
from marshmallow import fields, Schema

class ComentarioSchema(Schema):
    id = fields.Integer(required = True)
    id_identificador = fields.UUID(required=True)
    comentario = fields.Str(required=True)
