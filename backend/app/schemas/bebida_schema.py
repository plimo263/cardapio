from marshmallow import Schema, fields, validate
from .categoria_schema import CategoriaSchema
from ..extensions import db
from ..models.comentario import Comentario
from sqlalchemy import func


class BebidaSchema(Schema):
    id = fields.Int(dump_only=True)
    nome = fields.Str(required=True, validate=validate.Length(min=1))
    descricao = fields.Str(allow_none=True)
    preco = fields.Decimal(required=True, as_string=True)
    imagem_url = fields.Str(allow_none=True)
    ativo = fields.Bool()
    categoria_id = fields.Int(required=True)
    created_at = fields.DateTime(dump_only=True)
    categoria = fields.Nested(CategoriaSchema, dump_only=True)
    likes = fields.Int(dump_only=True)
    comments_count = fields.Method("get_comments_count", dump_only=True)
    avg_rating = fields.Method("get_avg_rating", dump_only=True)

    def get_comments_count(self, obj):
        try:
            return obj.comentarios.count()
        except Exception:
            # fallback to query
            return Comentario.query.filter_by(bebida_id=obj.id).count()

    def get_avg_rating(self, obj):
        try:
            avg = db.session.query(func.avg(Comentario.nota)).filter(Comentario.bebida_id == obj.id).scalar()
        except Exception:
            avg = None
        if avg is None:
            return None
        return float(round(avg, 2))
