from .extensions import api


def init_app(app):
    # initialize Api and register resource blueprints
    api.init_app(app)

    from .resources.categoria import bp as categoria_bp
    from .resources.bebida import bp as bebida_bp
    from .resources.imagem import bp as imagem_bp
    from .resources.user import bp as user_bp
    from .resources.auth import bp as auth_bp
    from .resources.comentario import bp as comentario_bp

    api.register_blueprint(categoria_bp)
    api.register_blueprint(bebida_bp)
    api.register_blueprint(imagem_bp)
    api.register_blueprint(user_bp)
    api.register_blueprint(auth_bp)
    api.register_blueprint(comentario_bp)
