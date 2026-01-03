from ..extensions import db
from datetime import datetime


class Imagem(db.Model):
    __tablename__ = "imagens"

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_name = db.Column(db.String(255), nullable=True)
    mime = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Imagem {self.filename!r}>"
