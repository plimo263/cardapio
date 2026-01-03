from flask import render_template, Blueprint


bp = Blueprint("views", __name__)

@bp.route('/bebidas_front')
def bebidas_page():
    return render_template("index.html")

@bp.route('/categorias_front')
def categorias_page():
    return render_template("index.html")

@bp.route('/usuarios')
def usuarios_page():
    return render_template("index.html")

@bp.route('/arquivos_front')
def arquivos_page():
    return render_template("index.html")

@bp.route('/admin')
def admin_page():
    return render_template("index.html")

@bp.route('/')
def home_page():
    return render_template("index.html")

@bp.route('/cardapio')
def cardapio_page():
    return render_template("index.html")