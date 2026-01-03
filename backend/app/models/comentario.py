from ..extensions import db
from datetime import datetime


class Comentario(db.Model):
    __tablename__ = "comentarios"

    id = db.Column(db.Integer, primary_key=True)
    bebida_id = db.Column(db.Integer, db.ForeignKey("bebidas.id"), nullable=False)
    texto = db.Column(db.Text, nullable=False)
    nota = db.Column(db.Integer, nullable=False)
    autor = db.Column(db.String(100), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    bebida = db.relationship("Bebida", back_populates="comentarios")

    def __repr__(self):
        return f"<Comentario {self.id} - bebida={self.bebida_id} nota={self.nota}>"
