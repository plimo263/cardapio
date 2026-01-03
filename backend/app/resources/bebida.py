from flask import render_template
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from ..models.bebida import Bebida
from ..models.categoria import Categoria
from ..schemas.bebida_schema import BebidaSchema
from ..extensions import db
from ..auth import require_api_key, require_auth_or_api_key

bp = Blueprint("bebidas", "bebidas", url_prefix="/bebidas", description="Operações com bebidas")


@bp.route("")
class BebidasList(MethodView):
    @bp.response(200, BebidaSchema(many=True))
    def get(self):
        return Bebida.query.filter_by(ativo=True).order_by(Bebida.nome).all()

    @bp.arguments(BebidaSchema)
    @bp.response(201, BebidaSchema)
    @require_auth_or_api_key()
    def post(self, data):
        # valida categoria
        categoria = Categoria.query.get(data.get("categoria_id"))
        if not categoria or not categoria.ativo:
            abort(400, message="Categoria inválida")

        bebida = Bebida(**data)
        db.session.add(bebida)
        db.session.commit()
        return bebida


@bp.route("/<int:id>")
class BebidaDetail(MethodView):
    @bp.response(200, BebidaSchema)
    def get(self, id):
        return Bebida.query.get_or_404(id)

    @bp.arguments(BebidaSchema)
    @bp.response(200, BebidaSchema)
    @require_auth_or_api_key()
    def put(self, data, id):
        bebida = Bebida.query.get_or_404(id)
        if "nome" in data:
            bebida.nome = data["nome"]
        if "descricao" in data:
            bebida.descricao = data["descricao"]
        if "preco" in data:
            bebida.preco = data["preco"]
        if "imagem_url" in data:
            bebida.imagem_url = data["imagem_url"]
        if "ativo" in data:
            bebida.ativo = data["ativo"]
        if "categoria_id" in data:
            categoria = Categoria.query.get(data.get("categoria_id"))
            if not categoria or not categoria.ativo:
                abort(400, message="Categoria inválida")
            bebida.categoria_id = data.get("categoria_id")

        db.session.commit()
        return bebida

    @bp.response(204)
    @require_auth_or_api_key()
    def delete(self, id):
        bebida = Bebida.query.get_or_404(id)
        bebida.ativo = False
        db.session.commit()
        return "", 204


@bp.route("/<int:id>/like")
class BebidaLike(MethodView):
    @bp.response(200, BebidaSchema)
    def post(self, id):
        # Increment likes atomically
        updated = db.session.query(Bebida).filter_by(id=id).update({"likes": Bebida.likes + 1})
        if not updated:
            abort(404, message="Bebida não encontrada")
        db.session.commit()
        return Bebida.query.get(id)

    @bp.response(200, BebidaSchema)
    def delete(self, id):
        # Decrement likes atomically, not going below 0
        bebida = Bebida.query.get(id)
        if not bebida:
            abort(404, message="Bebida não encontrada")

        # Only decrement if likes > 0
        updated = db.session.query(Bebida).filter(Bebida.id == id, Bebida.likes > 0).update({"likes": Bebida.likes - 1})
        if updated:
            db.session.commit()
        # return current state of bebida
        return Bebida.query.get(id)