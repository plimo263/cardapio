from ..extensions import db
from datetime import datetime


class Categoria(db.Model):
    __tablename__ = "categorias"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False, unique=True)
    ativo = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    bebidas = db.relationship("Bebida", back_populates="categoria", lazy="dynamic")

    def __repr__(self):
        return f"<Categoria {self.nome!r}>"
