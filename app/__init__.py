from flask import Flask
from Configs.config import Config
from app.routes.files.index import audio_to_text_bp
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    app.register_blueprint(audio_to_text_bp, url_prefix='/api/files')

    @app.route('/')
    def index():
        return '<h3>Hello world</h3>'

    return app
