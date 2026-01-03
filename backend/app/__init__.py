from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, ma
from .views import bp as views_bp
from flask import send_from_directory, abort
import os


def create_app():
    # Ensure Flask finds the project's top-level `templates/` and `static/`
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    templates_dir = os.path.join(base_dir, "templates")
    static_dir = os.path.join(base_dir, "static")
    app = Flask(__name__, template_folder=templates_dir, static_folder=static_dir)
    app.config.from_object(Config)
    
    # Configurar CORS baseado no ambiente
    if app.config.get("FLASK_ENV") == "development":
        # Em desenvolvimento, permite localhost
        CORS(app, resources={
            r"/*": {
                "origins": [
                    "http://localhost:5173", 
                    "http://localhost:3000", 
                    "http://127.0.0.1:5173",
                    "http://localhost:5000"
                ],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization", "X-Api-Key"],
                "supports_credentials": True
            }
        })
    else:
        # Em produção, apenas o domínio do site
        allowed_origin = os.getenv("ALLOWED_ORIGIN", "https://seudominio.com")
        CORS(app, resources={
            r"/*": {
                "origins": [allowed_origin],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization", "X-Api-Key"],
                "supports_credentials": True
            }
        })

    db.init_app(app)
    ma.init_app(app)

    app.register_blueprint(views_bp)

    # register blueprints via api module
    from . import api as api_module
    api_module.init_app(app)

    # Serve uploaded files at /uploads/<size>/<filename>
    @app.route('/uploads/<size>/<path:filename>')
    def uploaded_file(size, filename):
        if size not in ('original', 'mobile', 'thumb'):
            abort(404)
        base = app.config.get('UPLOAD_FOLDER')
        if not base:
            abort(500)
        full_dir = os.path.join(base, size)
        return send_from_directory(full_dir, filename)

    

    # Create DB in development
    if app.config.get("FLASK_ENV") == "development":
        with app.app_context():
            db.create_all()

    return app
