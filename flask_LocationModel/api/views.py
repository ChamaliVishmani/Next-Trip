from flask import Blueprint, jsonify, request
from . import db
from .models import Movie
import pandas as pd
from . import latitude_model, logitude_model

main = Blueprint('main', __name__)


@main.route('/add_movie', methods=['POST'])
def add_movie():
    movie_data = request.get_json()

    new_movie = Movie(title=movie_data['title'], rating=movie_data['rating'])

    db.session.add(new_movie)
    db.session.commit()

    return 'Done', 201


@main.route('/movies')
def movies():
    movies_list = Movie.query.all()
    movies = []

    for movie in movies_list:
        movies.append({'title': movie.title, 'rating': movie.rating})

    return jsonify({'movies': movies})


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
