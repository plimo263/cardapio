
from marshmallow import fields, Schema

class FavoritoSchema(Schema):
    id = fields.Integer(required = True)
    id_identificador = fields.UUID(required=True)