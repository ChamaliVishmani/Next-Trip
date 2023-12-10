# Next Trip

A WEB APPLICATION FOR TAXI DRIVERS TO DETERMINE BEST LOCATIONS AND TIMES TO BE AVAILABLE

# run backend

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

# run frontend

cd nextTrip_FrontEnd

(npm install)

npm start

# start mongoDB server

cd mongoDB_Server

(npm install)

npm start

# Project Tree

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
│  │  │  ├─ cluster_0_lat_model.pkl
│  │  │  ├─ cluster_0_lon_model.pkl
│  │  │  ├─ cluster_10_lat_model.pkl
│  │  │  ├─
│  │  │  ├─ cluster_99_lat_model.pkl
│  │  │  ├─ cluster_99_lon_model.pkl
│  │  │  ├─ cluster_9_lat_model.pkl
│  │  │  └─ cluster_9_lon_model.pkl
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
