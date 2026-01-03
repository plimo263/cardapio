import os
import io
import uuid
from flask import current_app, request, send_file
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from PIL import Image

from ..extensions import db
from ..models.imagem import Imagem
from ..schemas.imagem_schema import ImagemSchema
from ..auth import require_auth_or_api_key

bp = Blueprint("imagens", "imagens", url_prefix="/images", description="Operações com imagens")


def _allowed_image(mimetype: str) -> bool:
    return mimetype and mimetype.startswith("image/")


def _ensure_dirs(base):
    os.makedirs(os.path.join(base, "original"), exist_ok=True)
    os.makedirs(os.path.join(base, "mobile"), exist_ok=True)
    os.makedirs(os.path.join(base, "thumb"), exist_ok=True)


def _resize_and_save(image: Image.Image, dest_path: str, width: int | None):
    if width is None:
        # save original quality
        image.save(dest_path)
        return
    # maintain aspect ratio
    w, h = image.size
    if w <= width:
        image.save(dest_path)
        return
    ratio = width / float(w)
    new_size = (int(w * ratio), int(h * ratio))
    resized = image.resize(new_size, Image.LANCZOS)
    resized.save(dest_path)


@bp.route("")
class ImagensList(MethodView):
    @bp.response(200, ImagemSchema(many=True))
    def get(self):
        imagens = Imagem.query.order_by(Imagem.created_at.desc()).all()
        host = request.host_url.rstrip('/')
        items = []
        for img in imagens:
            # Provide a proxy-friendly static path for thumbnails so frontend can use /uploads/thumb/<filename>
            thumb_path = f"/uploads/thumb/{img.filename}"
            items.append({
                "id": img.id,
                "filename": thumb_path,
                "original_name": img.original_name,
                "mime": img.mime,
                "created_at": img.created_at if img.created_at else None,
                "urls": {
                    "original": f"{host}/images/{img.id}?size=original",
                    "mobile": f"{host}/images/{img.id}?size=mobile",
                    "thumb": f"{host}/images/{img.id}?size=thumb",
                },
            })
        return items
    @bp.response(201, ImagemSchema)
    @require_auth_or_api_key()
    def post(self):
        f = request.files.get("file")
        if not f:
            abort(400, message="Arquivo não enviado")

        if not _allowed_image(f.mimetype):
            abort(400, message="Tipo de arquivo inválido")

        cfg = current_app.config
        base = cfg.get("UPLOAD_FOLDER")
        if not base:
            abort(500, message="Upload folder não configurado")

        _ensure_dirs(base)

        # generate filename
        ext = os.path.splitext(f.filename)[1] or ""
        uid = uuid.uuid4().hex
        filename = f"{uid}{ext}"

        # read image via PIL
        try:
            img = Image.open(f.stream)
            img.convert("RGB")
        except Exception:
            abort(400, message="Não foi possível processar a imagem")

        # save different sizes
        sizes = cfg.get("IMAGE_SIZES", {})
        # original
        orig_path = os.path.join(base, "original", filename)
        img.save(orig_path)

        # mobile and thumb
        mobile_w = sizes.get("mobile")
        thumb_w = sizes.get("thumb")
        if mobile_w:
            mobile_path = os.path.join(base, "mobile", filename)
            _resize_and_save(img, mobile_path, mobile_w)
        if thumb_w:
            thumb_path = os.path.join(base, "thumb", filename)
            _resize_and_save(img, thumb_path, thumb_w)

        imagem = Imagem(filename=filename, original_name=f.filename, mime=f.mimetype)
        db.session.add(imagem)
        db.session.commit()

        # Return metadata + URLs
        result = {
            "id": imagem.id,
            "filename": imagem.filename,
            "original_name": imagem.original_name,
            "mime": imagem.mime,
            "urls": {
                "original": f"/images/{imagem.id}?size=original",
                "mobile": f"/images/{imagem.id}?size=mobile",
                "thumb": f"/images/{imagem.id}?size=thumb",
            },
        }
        return result, 201


@bp.route("/<int:id>")
class ImagemDetail(MethodView):
    def get(self, id):
        size = request.args.get("size", "original")
        imagem = Imagem.query.get_or_404(id)
        base = current_app.config.get("UPLOAD_FOLDER")
        if size not in ("original", "mobile", "thumb"):
            abort(400, message="size inválido")

        path = os.path.join(base, size, imagem.filename)
        if not os.path.exists(path):
            abort(404, message="Arquivo não encontrado")

        return send_file(path)

    @bp.response(204)
    @require_auth_or_api_key()
    def delete(self, id):
        imagem = Imagem.query.get_or_404(id)
        base = current_app.config.get("UPLOAD_FOLDER")
        if not base:
            abort(500, message="Upload folder não configurado")

        # remove arquivos em todas as pastas, ignorando se não existir
        for size in ("original", "mobile", "thumb"):
            try:
                p = os.path.join(base, size, imagem.filename)
                if os.path.exists(p):
                    os.remove(p)
            except Exception:
                # não falhar a operação de delete por causa de arquivos faltando
                pass

        # remover registro do banco
        db.session.delete(imagem)
        db.session.commit()
        return "", 204
