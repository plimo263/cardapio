from marshmallow import Schema, fields, validate


class CategoriaSchema(Schema):
    id = fields.Int(dump_only=True)
    nome = fields.Str(required=True, validate=validate.Length(min=1))
    ativo = fields.Bool()
    created_at = fields.DateTime(dump_only=True)
