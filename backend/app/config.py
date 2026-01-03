import os
from dotenv import load_dotenv

load_dotenv()

FLASK_ENV = os.getenv("FLASK_ENV", "development")
SECRET_KEY = os.getenv("SECRET_KEY", "change-me")
DATABASE_URL = os.getenv("DATABASE_URL")


class Config:
    FLASK_ENV = FLASK_ENV
    ENV = FLASK_ENV
    DEBUG = FLASK_ENV == "development"
    SECRET_KEY = SECRET_KEY
    API_KEY = os.getenv("API_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    API_TITLE = "Cardápio API"
    API_VERSION = "v1"
    OPENAPI_VERSION = "3.0.2"
    ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "http://localhost:5173")

    if FLASK_ENV == "development":
        SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"
    else:
        SQLALCHEMY_DATABASE_URI = DATABASE_URL or "sqlite:///app.db"
    # Uploads
    BASE_DIR = os.path.dirname(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB
    # Image sizes: width in pixels (maintain aspect ratio)
    IMAGE_SIZES = {
        "thumb": 200,
        "mobile": 800,
        "original": None,
    }
