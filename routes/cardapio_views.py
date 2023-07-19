from flask import Blueprint, render_template, redirect

cardapio_view = Blueprint('cardapio_view', __name__)

@cardapio_view.route('/', methods = ['GET'])
def ver_cardapio_view():
    return render_template('template_react.html')

@cardapio_view.route('/cardapio', methods = ['GET'])
def ver_cardapio_view_redirect():
    return redirect('/')