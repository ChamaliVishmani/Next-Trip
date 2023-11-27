import React, { useState } from "react";
import { BrowserRouter, Route, Routes, json } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { Helmet } from "react-helmet";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";

import "./App.css";
import { PredictedLocation } from "./components/PredictedLocation.js";
import Dashboard from "./components/InsightsDashboard.js";
import SignUp from "./components/SignUp/signUp.js";
import Login from "./components/Login/login.js";
import InsightsDashboard from "./components/InsightsDashboard.js";
// import LocationPicker from "./components/RequestRide";
import RequestRide from "./components/RequestRide.js";
import RideRequests from "./components/RideRequests.js";

function getUserLoggedIn() {
  const role = sessionStorage.getItem("role");
  return role;
}

function App() {
  // const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userType, setUserType] = useState("all");
  const loggedInUserRole = getUserLoggedIn();
  const [userName, setUserName] = useState("");

  return (
    <div className="bg-blue-500 text-white p-4">
      <Helmet>
        <title>Next Trip</title>
      </Helmet>

      <h1>Next Trip</h1>
      <BrowserRouter>
        <Routes>
          <Route
            path=""
            element={
              <SnackbarProvider maxSnack={3}>
                <Login />
              </SnackbarProvider>
            }
          />
          <Route
            path="/login"
            element={
              <SnackbarProvider maxSnack={3}>
                <Login />
              </SnackbarProvider>
            }
          />
          <Route
            path="/signUp"
            element={
              <SnackbarProvider maxSnack={3}>
                <SignUp />
              </SnackbarProvider>
            }
          />
          <Route path="/preferences" element={<RideRequests />} />
          <Route
            path="/predict_location"
            element={
              loggedInUserRole == "Driver" ? <PredictedLocation /> : <Login />
            }
          />
          <Route
            path="/insights"
            element={
              loggedInUserRole == "Driver" ? <InsightsDashboard /> : <Login />
            }
          />
          <Route
            path="/request_ride"
            element={loggedInUserRole == "Rider" ? <RequestRide /> : <Login />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
