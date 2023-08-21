from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import joblib

db = SQLAlchemy()
latitude_model = joblib.load("./models/lat_model.pkl")
logitude_model = joblib.load("./models/lon_model.pkl")


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

    db.init_app(app)

    from .views import main
    app.register_blueprint(main)

    return app
