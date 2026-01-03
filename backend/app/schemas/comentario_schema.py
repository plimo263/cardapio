from marshmallow import Schema, fields, validate


class ComentarioSchema(Schema):
    id = fields.Int(dump_only=True)
    bebida_id = fields.Int(dump_only=True)
    texto = fields.Str(required=True, validate=validate.Length(min=1))
    nota = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    autor = fields.Str(allow_none=True)
    latitude = fields.Float(allow_none=True)
    longitude = fields.Float(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
