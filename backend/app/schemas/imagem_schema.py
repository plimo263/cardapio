from marshmallow import Schema, fields


class ImagemSchema(Schema):
    id = fields.Int(dump_only=True)
    filename = fields.Str(dump_only=True)
    original_name = fields.Str(dump_only=True)
    mime = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True, format="%Y-%m-%d %H:%M:%S")
