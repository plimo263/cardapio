from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import request, g
from ..extensions import db
from ..models.user import User
from ..schemas.user_schema import UserSchema, UserCreateSchema, UserLoginSchema, UserUpdateSchema
from ..auth import require_auth_or_api_key

bp = Blueprint("users", "users", url_prefix="/users", description="Operações com usuários")


@bp.route("")
class UsersList(MethodView):
    @bp.response(200, UserSchema(many=True))
    @require_auth_or_api_key(admin_required=True)
    def get(self):
        users = User.query.order_by(User.created_at.desc()).all()
        return users

    @bp.arguments(UserCreateSchema)
    @bp.response(201, UserSchema)
    @require_auth_or_api_key(admin_required=True)
    def post(self, data):
        username = data.get("username")
        if User.query.filter_by(username=username).first():
            abort(400, message="Username já existe")
        user = User(username=username, email=data.get("email"), is_admin=data.get("is_admin", False), active=data.get("active", True))
        user.set_password(data.get("password"))
        db.session.add(user)
        db.session.commit()
        return user


@bp.route("/<int:id>")
class UserDetail(MethodView):
    @bp.response(200, UserSchema)
    @require_auth_or_api_key(admin_required=True)
    def get(self, id):
        return User.query.get_or_404(id)

    # use an update schema where password is optional
    @bp.arguments(UserUpdateSchema)
    @bp.response(200, UserSchema)
    @require_auth_or_api_key(admin_required=True)
    def put(self, data, id):
        user = User.query.get_or_404(id)
        if "username" in data and data.get("username") != user.username:
            if User.query.filter_by(username=data.get("username")).first():
                abort(400, message="Username já existe")
            user.username = data.get("username")
        if "email" in data:
            user.email = data.get("email")
        if "password" in data:
            user.set_password(data.get("password"))
        if "is_admin" in data:
            user.is_admin = data.get("is_admin")
        if "active" in data:
            user.active = data.get("active")
        db.session.commit()
        return user

    @bp.response(204)
    @require_auth_or_api_key(admin_required=True)
    def delete(self, id):
        user = User.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()
        return "", 204


@bp.route("/me")
class UserMe(MethodView):
    @bp.response(200, UserSchema)
    @require_auth_or_api_key(admin_required=False)
    def get(self):
        # current user provided by decorator in g.current_user
        u = getattr(g, "current_user", None)
        if not u:
            abort(401, message="Usuário não autenticado")
        # ensure active user
        if not getattr(u, 'active', True):
            abort(403, message='Usuário inativo')
        return u
