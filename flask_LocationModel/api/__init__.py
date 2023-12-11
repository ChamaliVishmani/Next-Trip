from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
import joblib
import pandas as pd

from config.db_config import DB_URL

latitude_model = joblib.load("./models/lat_model.pkl")
logitude_model = joblib.load("./models/lon_model.pkl")
kmeans_model = joblib.load("./models/kmeans_model.pkl")

hourcount_data = pd.read_csv("./data/hourcount_data.csv")
daycount_data = pd.read_csv("./data/daycount_data.csv")
dayHrcount_data = pd.read_csv("./data/dayHrcount_data.csv")
heatmap_data = pd.read_csv("./data/heatmap_data.csv")

socketio = SocketIO()


def create_app():
    app = Flask(__name__)

    CORS(app)

    socketio.init_app(app, cors_allowed_origins="*")

    from .apis import main
    app.register_blueprint(main)

    return app
