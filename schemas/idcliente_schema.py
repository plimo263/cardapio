

from marshmallow import fields, Schema

class IdClienteSchema(Schema):
    id_identificador = fields.UUID(required = False)