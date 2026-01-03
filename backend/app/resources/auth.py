from flask.views import MethodView
from flask_smorest import Blueprint, abort
from ..schemas.user_schema import UserLoginSchema
from ..models.user import User
from ..extensions import db

bp = Blueprint("auth", "auth", url_prefix="/auth", description="Autenticação")


@bp.route("/login")
class Login(MethodView):
    @bp.arguments(UserLoginSchema)
    def post(self, data):
        username = data.get("username")
        password = data.get("password")
        # Busca por username ou email
        user = User.query.filter(
            (User.username == username) | (User.email == username)
        ).first()
        if not user or not user.check_password(password):
            abort(401, message="Credenciais inválidas")
        token = user.generate_token()
        db.session.commit()
        return {"token": token}


@bp.route("/logout")
class Logout(MethodView):
    def post(self):
        auth = None
        from flask import request
        auth = request.headers.get("Authorization")
        if not auth or not auth.lower().startswith("bearer "):
            abort(401, message="Missing token")
        token = auth.split(None, 1)[1].strip()
        user = User.query.filter_by(auth_token=token).first()
        if not user:
            abort(401, message="Invalid token")
        user.revoke_token()
        db.session.commit()
        return {"status": "ok"}
