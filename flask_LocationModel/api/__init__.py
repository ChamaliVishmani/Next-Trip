from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_socketio import SocketIO
import joblib
import pandas as pd
import pymongo

from config.db_config import DB_URL

client = pymongo.MongoClient(DB_URL)

mongoDb = client['insights']
collection = mongoDb['heatmap_data']

heatmap_data = list(collection.find({}))
heatmap_data_df = pd.DataFrame(heatmap_data)

db = SQLAlchemy()
latitude_model = joblib.load("./models/lat_model.pkl")
logitude_model = joblib.load("./models/lon_model.pkl")
kmeans_model = joblib.load("./models/kmeans_model.pkl")

hourcount_data = pd.read_csv("./data/hourcount_data.csv")
daycount_data = pd.read_csv("./data/daycount_data.csv")
dayHrcount_data = pd.read_csv("./data/dayHrcount_data.csv")

socketio = SocketIO()


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

    db.init_app(app)
    CORS(app)

    socketio.init_app(app)

    from .apis import main
    app.register_blueprint(main)

    return app
