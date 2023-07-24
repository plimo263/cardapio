from marshmallow import fields, Schema


msg_errors = {
    "nome": {
        "required": "O campo nome é requerido",
    },
    "categoria": {
        "required": "A categoria em que o item vai ser anexado precisa ser informada",
    },
    "descricao": {
        "required": "Necessário descrever o item que esta sendo criado"
    }
}

class ItemSchema(Schema):
    nome = fields.Str(required=True, error_messages=msg_errors['nome'])
    categoria = fields.Str(required=True, error_messages=msg_errors["categoria"])
    descricao = fields.Str(required= True, error_messages=msg_errors['descricao'])
    
    id = fields.Integer(dump_only=True)
    thumb = fields.Str(dump_only=True)
    normal = fields.Str(dump_only=True)
    original = fields.Str(dump_only=True)
    total_favoritos = fields.Integer(dump_only=True)
    meu_favorito = fields.Bool(dump_only=True)

