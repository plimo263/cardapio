from marshmallow import fields, Schema

class RedeSocialSchema(Schema):

    nome = fields.Str(dump_only=True)
    link = fields.Str(dump_only=True)
    icone = fields.Str(dump_only=True)