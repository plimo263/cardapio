from ..extensions import db
from datetime import datetime


class Bebida(db.Model):
    __tablename__ = "bebidas"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text)
    preco = db.Column(db.Numeric(10, 2), nullable=False)
    imagem_url = db.Column(db.String(255))
    ativo = db.Column(db.Boolean, default=True, nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey("categorias.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    likes = db.Column(db.Integer, default=0, nullable=False)

    categoria = db.relationship("Categoria", back_populates="bebidas")
    comentarios = db.relationship("Comentario", back_populates="bebida", lazy="dynamic", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Bebida {self.nome!r} - {self.preco}>"
