from extensions import db 

class RedeSocial(db.Model):

    id = db.Column(db.Integer, primary_key = True, autoincrement = True, nullable = False)
    nome = db.Column(db.String(100), nullable = False)
    link = db.Column(db.String(255), nullable = False)
    icone = db.Column(db.String(50), nullable = False)