from flask import Blueprint, render_template, redirect, session

acesso_login_view = Blueprint('acesso_login_view', __name__)

@acesso_login_view.route('/acesso_login', methods = ['GET'])
def ver_acesso_login_view():
    return render_template('template_react.html')

@acesso_login_view.route('/logout', methods = ['GET'])
def logout_app():
    session.clear()
    return redirect('/acesso_login')