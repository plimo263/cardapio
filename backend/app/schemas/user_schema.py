from marshmallow import Schema, fields


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    email = fields.Str(allow_none=True)
    is_admin = fields.Bool()
    active = fields.Bool()
    created_at = fields.DateTime(dump_only=True)


class UserCreateSchema(Schema):
    username = fields.Str(required=True)
    email = fields.Str(allow_none=True)
    password = fields.Str(required=True)
    is_admin = fields.Bool(load_default=False)
    active = fields.Bool(load_default=True)


class UserUpdateSchema(Schema):
    username = fields.Str()
    email = fields.Str(allow_none=True)
    # password optional on update
    password = fields.Str(allow_none=True)
    is_admin = fields.Bool()
    active = fields.Bool()


class UserLoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)
