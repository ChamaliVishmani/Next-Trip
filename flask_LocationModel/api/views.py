from flask import Blueprint, jsonify, request
from . import db
from .models import Movie
import pandas as pd
from . import latitude_model, logitude_model, heatmap_data, hourcount_data, daycount_data, dayHrcount_data

main = Blueprint('main', __name__)


# @main.route('/add_movie', methods=['POST'])
# def add_movie():
#     movie_data = request.get_json()

#     new_movie = Movie(title=movie_data['title'], rating=movie_data['rating'])

#     db.session.add(new_movie)
#     db.session.commit()

#     return 'Done', 201


# @main.route('/movies')
# def movies():
#     movies_list = Movie.query.all()
#     movies = []

#     for movie in movies_list:
#         movies.append({'title': movie.title, 'rating': movie.rating})

#     return jsonify({'movies': movies})


@main.route('/predict_location', methods=['POST'])
def predict_location():
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


@main.route('/heatmap_data', methods=['POST'])
def get_heatmap_data():
    try:
        data = request.get_json()

        if 'weekday' not in data or 'hour' not in data:
            return jsonify({'error': 'Missing parameters (weekday or hour)'}), 400

        new_weekday = data['weekday']
        new_hour = data['hour']

        filtered_data = heatmap_data[(heatmap_data['weekday'] == new_weekday) & (
            heatmap_data['hour'] == new_hour)]

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

        response = filtered_data.to_dict(
            orient='records')

        return jsonify({'dayHrcount_data': response}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400
