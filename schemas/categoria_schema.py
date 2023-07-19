
from marshmallow import fields, Schema

class CategoriaSchema(Schema):
    descricao = fields.Str()
    icone = fields.Str()