from marshmallow import fields, Schema

class UsuarioSchema(Schema):
    nome = fields.Str(dump_only=True)
    email = fields.Str(dump_only=True)
    data_acesso = fields.Str(dump_only=True)

