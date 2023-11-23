# Next Trip

CO3554 Data management project

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
│  ---
├─ .gitattributes
├─ .gitignore
├─ .vscode
│  └─ settings.json
├─ flask_LocationModel
│  ├─ .ipynb_checkpoints
│  ├─ .vscode
│  │  └─ settings.json
│  ├─ api
│  │  ├─ models.py
│  │  ├─ views.py
│  │  └─ __init__.py
│  ├─ instance
│  │  └─ database.db
│  ├─ notebooks
│  │  ├─ .ipynb_checkpoints
│  │  │  └─ Lat_Lon_Model-checkpoint.ipynb
│  │  ├─ dataCSVToMongo.ipynb
│  │  ├─ Lat_Lon_Model.ipynb
│  │  └─ Maps_Model.ipynb
│  ├─ package-lock.json
│  └─ requirements.txt
├─ mongoDB_Server
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
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ auth.routes.js
│  │  ├─ ride.routes.js
│  │  └─ user.routes.js
│  └─ server.js
├─ nextTrip_FrontEnd
│  ├─ .gitignore
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
│  │  │  ├─ Movies.js
│  │  │  ├─ PredictedLocation.js
│  │  │  ├─ Preferences.js
│  │  │  ├─ RequestRide.js
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
│  │  └─ index.js
│  └─ tailwind.config.js
└─ README.md

```
