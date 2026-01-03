from ..extensions import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import uuid


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    active = db.Column(db.Boolean, default=True, nullable=False)
    auth_token = db.Column(db.String(64), unique=True, nullable=True)
    token_created_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def generate_token(self):
        token = uuid.uuid4().hex
        self.auth_token = token
        self.token_created_at = datetime.utcnow()
        return token

    def revoke_token(self):
        self.auth_token = None
        self.token_created_at = None

    def __repr__(self):
        return f"<User {self.username!r}>"
