from flask import Blueprint, render_template, redirect
from utils.authenticator import Autenticator

cardapio_view = Blueprint('cardapio_view', __name__)

@cardapio_view.route('/', methods = ['GET'])
def ver_cardapio_view():
    return render_template('template_react.html')

@cardapio_view.route('/cardapio', methods = ['GET'])
def ver_cardapio_view_redirect():
    return redirect('/')

@cardapio_view.route('/manutencao_itens', methods = ['GET'])
@Autenticator(pagina_view=True)
def ver_cardapio_view_manutencao_itens():
    return render_template('/template_react.html')

