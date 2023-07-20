from marshmallow import fields, Schema, validate


msg_errors = {
    "email": {
        "required": "O campo é requerido",
        "msg_error": "Não é um endereço de E-mail valido",
    },
    "senha": {
        "required": "Necessário informar a senha",
        "regex": "A senha deve ter 1 letra maiuscula, 1 minuscula e um caractere especial"
    },
    "captcha": {
        "required": 'Recaptcha não enviado, impossível validar autenticação',
    }
}

class AcessLoginSchema(Schema):
    email = fields.Email(required=True, error_messages={
        "required": msg_errors['email']['required'],
        "invalid": msg_errors["email"]['msg_error'],

    })
    senha = fields.Str(
        # validate=validate.Regexp(
        #     "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!%#*?&]{8,}$",
        #     error=msg_errors["senha"]["regex"]
        # ),
        required=True,
        error_messages={
            "required": msg_errors["senha"]["required"],
        }
    )
    captcha = fields.Str(required=True, error_messages={
        'required': msg_errors['captcha']['required']
    })

    token = fields.Str(dump_only=True)


