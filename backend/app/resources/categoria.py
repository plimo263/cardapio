from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy import func
from ..models.categoria import Categoria
from ..schemas.categoria_schema import CategoriaSchema
from ..extensions import db
from ..auth import require_auth_or_api_key

bp = Blueprint("categorias", "categorias", url_prefix="/categorias", description="Operações com categorias")


@bp.route("")
class CategoriasList(MethodView):
    @bp.response(200, CategoriaSchema(many=True))
    def get(self):
        return Categoria.query.filter_by(ativo=True).order_by(Categoria.id).all()

    @bp.arguments(CategoriaSchema)
    @bp.response(201, CategoriaSchema)
    @require_auth_or_api_key()
    def post(self, data):
        nome = data.get("nome", "").strip()
        existing = Categoria.query.filter(func.lower(Categoria.nome) == nome.lower()).first()
        if existing:
            if not existing.ativo:
                existing.ativo = True
                db.session.commit()
                return existing, 200
            abort(400, message="Já existe uma categoria com esse nome")

        categoria = Categoria(**data)
        db.session.add(categoria)
        db.session.commit()
        return categoria


@bp.route("/<int:id>")
class CategoriaDetail(MethodView):
    @bp.response(200, CategoriaSchema)
    def get(self, id):
        return Categoria.query.get_or_404(id)

    @bp.arguments(CategoriaSchema)
    @bp.response(200, CategoriaSchema)
    @require_auth_or_api_key()
    def put(self, data, id):
        categoria = Categoria.query.get_or_404(id)
        if "nome" in data:
            nome = data.get("nome", "").strip()
            existing = Categoria.query.filter(func.lower(Categoria.nome) == nome.lower(), Categoria.id != id).first()
            if existing:
                abort(400, message="Já existe uma categoria com esse nome")
            categoria.nome = data["nome"]
        if "ativo" in data:
            categoria.ativo = data["ativo"]
        db.session.commit()
        return categoria

    @bp.response(204)
    @require_auth_or_api_key()
    def delete(self, id):
        categoria = Categoria.query.get_or_404(id)
        categoria.ativo = False
        db.session.commit()
        return "", 204
