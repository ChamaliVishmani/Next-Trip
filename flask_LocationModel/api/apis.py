from flask import Blueprint, jsonify, request
import joblib
import pandas as pd

from . import latitude_model, logitude_model, heatmap_data_df, hourcount_data, daycount_data, dayHrcount_data, kmeans_model, socketio

main = Blueprint('main', __name__)


@main.route('/predict_location/allLocations', methods=['POST'])
def predict_location_all():
    try:
        data = request.get_json()

        new_weekday = data['weekday']
        new_hour = data['hour']

        new_X = pd.DataFrame({'weekday': [new_weekday], 'hour': [new_hour]})
        predicted_lat = latitude_model.predict(new_X)
        predicted_lon = logitude_model.predict(new_X)

        # Convert to list if necessary
        response = {'predicted_lat': predicted_lat.tolist(
        ), 'predicted_lon': predicted_lon.tolist()}

        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/predict_location/closeLocations', methods=['POST'])
def predict_location_close():
    try:
        data = request.get_json()

        new_weekday = data['weekday']
        new_hour = data['hour']
        lat = data['lat']
        lon = data['lon']

        new_cluster = kmeans_model.predict([[lat, lon]])[0]
        predicted_model = joblib.load(
            "./models/clusters/cluster_{}_model.pkl".format(new_cluster))
        predicted_cluster = predicted_model.predict(
            [[new_weekday, new_hour]])[0]
        cluster_centroid = kmeans_model.cluster_centers_[predicted_cluster]
        predicted_latitude, predicted_longitude = cluster_centroid[0], cluster_centroid[1]

        response = {'predicted_lat': predicted_latitude,
                    'predicted_lon': predicted_longitude}

        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/heatmap_data', methods=['POST'])
def get_heatmap_data():
    try:
        data = request.get_json()

        if 'weekday' not in data or 'hour' not in data:
            return jsonify({'error': 'Missing parameters (weekday or hour)'}), 400

        new_weekday = data['weekday']
        new_hour = data['hour']

        filtered_data = heatmap_data_df[(heatmap_data_df['weekday'] == new_weekday) & (
            heatmap_data_df['hour'] == new_hour)]

        response = filtered_data[['Lat', 'Lon', 'weight']].to_dict(
            orient='records')

        return jsonify({'heatmap_data': response}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/count_data/by_hour', methods=['GET'])
def get_count_data_hr():
    try:
        response = hourcount_data.to_dict(
            orient='records')

        return jsonify({'hourcount_data': response}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/count_data/by_day', methods=['GET'])
def get_count_data_day():
    try:
        response = daycount_data.to_dict(
            orient='records')

        return jsonify({'daycount_data': response}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/count_data/by_dayHr', methods=['POST'])
def get_count_data_dayHr():
    try:
        data = request.get_json()

        if 'weekday' not in data:
            return jsonify({'error': 'Missing parameters weekday'}), 400

        new_weekday = data['weekday']

        filtered_data = dayHrcount_data[(
            dayHrcount_data['weekday'] == new_weekday)]

        response = filtered_data[['count', 'hour']].to_dict(
            orient='records')

        return jsonify({'dayHrcount_data': response}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/ride/request', methods=['POST'])
def request_ride():
    try:
        data = request.get_json()

        dateTime = data['dateTime']
        pickupLan = data['pickupLan'],
        pickupLon = data['pickupLon'],
        destinationLan = data['destinationLan'],
        destinationLon = data['destinationLon'],
        userName = data['userName']
        accepted = data['accepted']

        socketio.emit('new_ride_request', data)

        return 'Request ride', 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@main.route('/ride/accept', methods=['POST'])
def accept_ride():
    try:
        data = request.get_json()

        dateTime = data['dateTime']
        pickupLan = data['pickupLan'],
        pickupLon = data['pickupLon'],
        destinationLan = data['destinationLan'],
        destinationLon = data['destinationLon'],
        userName = data['userName']
        driverName = data['driverName']
        driverLan = data['driverLan']
        driverLon = data['driverLon']
        accepted = data['accepted']

        socketio.emit('ride_accept', data)

        return 'Accept ride', 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400
