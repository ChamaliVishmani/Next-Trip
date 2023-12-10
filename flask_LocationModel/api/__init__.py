from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_socketio import SocketIO
import joblib
import pandas as pd
import pymongo
import urllib.parse

from config.db_config import DB_URL

try:
    client = pymongo.MongoClient(DB_URL)
    print("Connected to MongoDB")

    mongoDb = client['insights']
    collection = mongoDb['heatmap_data']
    print("Connected to heatmap_data collection")
    # print(
    #     f"Number of documents in the collection: {collection.count_documents({})}")
    # heatmap_data = list(collection.find({}).explain())
    # heatmap_data = [print(doc) or doc for doc in collection.find({})]

    # print("Retrieved heatmap_data")
    # heatmap_data_df = pd.DataFrame(heatmap_data)
    # print("Created heatmap_data_df")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

# db = SQLAlchemy()
latitude_model = joblib.load("./models/lat_model.pkl")
logitude_model = joblib.load("./models/lon_model.pkl")
kmeans_model = joblib.load("./models/kmeans_model.pkl")

hourcount_data = pd.read_csv("./data/hourcount_data.csv")
daycount_data = pd.read_csv("./data/daycount_data.csv")
dayHrcount_data = pd.read_csv("./data/dayHrcount_data.csv")

socketio = SocketIO()


def create_app():
    app = Flask(__name__)
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

    # db.init_app(app)
    CORS(app)

    socketio.init_app(app, cors_allowed_origins="*")

    from .apis import main
    app.register_blueprint(main)

    return app
