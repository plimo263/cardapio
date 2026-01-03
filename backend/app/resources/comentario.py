from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import request
from ..models.bebida import Bebida
from ..models.comentario import Comentario
from ..schemas.comentario_schema import ComentarioSchema
from ..extensions import db


bp = Blueprint("comentarios", "comentarios", url_prefix="/bebidas", description="Comentários por bebida")


@bp.route("/<int:bebida_id>/comentarios")
class ComentariosList(MethodView):
    @bp.response(200, ComentarioSchema(many=True))
    def get(self, bebida_id):
        bebida = Bebida.query.get_or_404(bebida_id)
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 10))

        q = Comentario.query.filter_by(bebida_id=bebida_id).order_by(Comentario.created_at.desc())
        pag = q.paginate(page=page, per_page=per_page, error_out=False)
        items = pag.items
        total = pag.total
        # return items and set total in header
        return items, 200, {"X-Total-Count": str(total)}

    @bp.arguments(ComentarioSchema)
    @bp.response(201, ComentarioSchema)
    def post(self, data, bebida_id):
        bebida = Bebida.query.get_or_404(bebida_id)
        if not bebida.ativo:
            abort(400, message="Bebida não encontrada ou inativa")

        comentario = Comentario(bebida_id=bebida_id, **data)
        db.session.add(comentario)
        db.session.commit()
        return comentario


@bp.route("/comentarios/<int:comentario_id>")
class ComentarioItem(MethodView):
    @bp.response(200, ComentarioSchema)
    def get(self, comentario_id):
        c = Comentario.query.get_or_404(comentario_id)
        return c

    @bp.arguments(ComentarioSchema)
    @bp.response(200, ComentarioSchema)
    def put(self, data, comentario_id):
        c = Comentario.query.get_or_404(comentario_id)
        # allow updating only a subset of fields
        for field in ("texto", "nota", "autor", "latitude", "longitude"):
            if field in data:
                setattr(c, field, data[field])
        db.session.commit()
        return c

    def delete(self, comentario_id):
        c = Comentario.query.get_or_404(comentario_id)
        db.session.delete(c)
        db.session.commit()
        return {}, 204
