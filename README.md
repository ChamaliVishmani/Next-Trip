# Next Trip

- A web application which provides insight on times and locations a driver could get more rides based on past rides data

  - Give driver a location where they are highly likely to get a ride 
according to day and time and location of the driver.
    - Processes the data and make a model to predict the rider location according to time using *RandomForestRegressor*
      - Model Root-mean-square deviation
        - Latitude RMSE: 0.035844013391631055
        - Longitude RMSE: 0.05092007337037105
    - Apply K-means clustering on the location data and train a *RandomForestRegressor* model for each cluster
        - Average RMSE for latitude: 0.022379436806737547
        - Average RMSE for longitude: 0.021696016348763895
  - Give a heat map of rides to show how the demand spreads.
  - Give insights of rider pickups by day and hour.
  - Update the models and insights periodically with new rides.

[Dataset used - Kaggle|Uber Pickups in New York City](https://www.kaggle.com/datasets/fivethirtyeight/uber-pickups-in-new-york-city)


## Used languages, platforms etc.

- Python
- Flask
- MongoDB
- ReactJS
- REST APIs

## Demo videos

https://github.com/ChamaliVishmani/Next-Trip/assets/75886556/eb25f2c4-570f-4a22-bc7e-cf45c056c8d5

https://github.com/ChamaliVishmani/Next-Trip/assets/75886556/f65b6bac-fe5d-4a67-8651-0f17b72c2a24

## Run backend
```
(in a command prompt)

cd flask_LocationModel

env\Scripts\activate

(pip install -r requirements.txt)

set FLASK_APP=api

set FLASK_DEBUG=1

flask run

---

Jupyter Kernel for Your Virtual Environment:
python -m ipykernel install --user --name=jupyterenv_nexttrip

```

## Run frontend

```
cd nextTrip_FrontEnd

(npm install)

npm start

```

## Start mongoDB server
```
cd mongoDB_Server

(npm install)

npm start
```
## Project Tree

```
NextTrip
├─ .git
│  ├─
├─ .gitattributes
├─ .gitignore
├─ .vscode
│  └─ settings.json
├─ flask_LocationModel
│  ├─ .ipynb_checkpoints
│  ├─ .vscode
│  │  └─ settings.json
│  ├─ api
│  │  ├─ apis.py
│  │  ├─ app.py
│  │  ├─ trainModels.py
│  │  ├─ __init__.py
│  │  └─ __pycache__
│  │     ├─ apis.cpython-310.pyc
│  │     ├─ models.cpython-310.pyc
│  │     └─ __init__.cpython-310.pyc
│  ├─ config
│  │  ├─ db_config.py
│  │  ├─ __init__.py
│  │  └─ __pycache__
│  │     ├─ db_config.cpython-310.pyc
│  │     └─ __init__.cpython-310.pyc
│  ├─ data
│  │  ├─ daycount_data.csv
│  │  ├─ dayHrcount_data.csv
│  │  ├─ heatmap_data.csv
│  │  ├─ hourcount_data.csv
│  │  └─ uber-raw-data-apr14.csv
│  ├─ env
│  │  ├─
│  ├─ instance
│  ├─ models
│  │  ├─ clusters
│  │  │  ├─ cluster_0_model.pkl
│  │  │  ├─ cluster_10_model.pkl
│  │  │  ├─
│  │  │  ├─ cluster_99_model.pkl
│  │  │  └─ cluster_9_model.pkl
│  │  ├─ kmeans_model.pkl
│  │  ├─ lat_model.pkl
│  │  ├─ lon_model.pkl
│  │  └─ rnd_columns.pkl
│  ├─ notebooks
│  │  ├─ .ipynb_checkpoints
│  │  │  └─ Lat_Lon_Model-checkpoint.ipynb
│  │  ├─ dataCSVToMongo.ipynb
│  │  ├─ Lat_Lon_Model.ipynb
│  │  ├─ locationClusters.ipynb
│  │  ├─ Maps_Model.ipynb
│  │  └─ notebookScripts
│  │     ├─ Lat_Lon_ModelScript.py
│  │     ├─ LocationClustersScript.py
│  │     └─ Maps_ModelScript.py
│  ├─ package-lock.json
│  └─ requirements.txt
├─ mongoDB_Server
│  ├─ config
│  │  ├─ auth.config.js
│  │  └─ db.config.js
│  ├─ controllers
│  │  ├─ auth.controller.js
│  │  ├─ rides.controller.js
│  │  └─ user.controller.js
│  ├─ middleware
│  │  ├─ authJwt.js
│  │  └─ verifySignUp.js
│  ├─ models
│  │  ├─ index.js
│  │  ├─ rider.model.js
│  │  ├─ role.models.js
│  │  └─ user.model.js
│  ├─ node_modules
│  │  ├─
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ auth.routes.js
│  │  ├─ ride.routes.js
│  │  └─ user.routes.js
│  └─ server.js
├─ nextTrip_FrontEnd
│  ├─ .gitignore
│  ├─ node_modules
│  │  ├─
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  └─ robots.txt
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.js
│  │  ├─ components
│  │  │  ├─ InsightsDashboard.js
│  │  │  ├─ Login
│  │  │  │  ├─ login.css
│  │  │  │  └─ login.js
│  │  │  ├─ PredictedLocation.js
│  │  │  ├─ RequestRide.js
│  │  │  ├─ RideRequests.js
│  │  │  ├─ SignUp
│  │  │  │  ├─ signUp.css
│  │  │  │  └─ signUp.js
│  │  │  └─ utils
│  │  │     ├─ locationApi.js
│  │  │     ├─ loginApi.js
│  │  │     ├─ ridesApi.js
│  │  │     ├─ userContent.js
│  │  │     └─ utils.js
│  │  ├─ index.css
│  │  ├─ index.js
│  │  └─ keys.js
│  └─ tailwind.config.js
├─ Pipfile
├─ Pipfile.lock
└─ README.md

```
