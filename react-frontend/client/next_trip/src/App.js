import React, { useState } from "react";
import { BrowserRouter, Route, Routes, json } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { Helmet } from "react-helmet";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";

import "./App.css";
import { PredictedLocation } from "./components/PredictedLocation.js";
import Dashboard from "./components/Dashboard.js";
import Preferences from "./components/Preferences.js";
import SignUp from "./components/SignUp/signUp.js";
import Login from "./components/Login/login.js";

// function setUserLoggedInRole(userLoggedIn) {
//   sessionStorage.setItem("userLoggedIn", userLoggedIn);
// }

function getUserLoggedIn() {
  const role = sessionStorage.getItem("role");
  return role;
}

function App() {
  const [userSignedUp, setUserSignedUp] = useState(true);
  // const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userType, setUserType] = useState("all");
  const loggedInUserRole = getUserLoggedIn();

  return (
    <Container style={{ marginTop: 40 }}>
      <Helmet>
        <title>Next Trip</title>
      </Helmet>
      {/* <PredictedLocation /> */}
      {/* <SnackbarProvider maxSnack={3}>
        <Login
          setUserLoggedIn={setUserLoggedIn}
          // setRole={setRole}
          // setAccessToken={setAccessToken}
        />
        ;
      </SnackbarProvider> */}
      <div className="wrapper">
        <h1>Next Trip Application</h1>
        <BrowserRouter>
          <Routes>
            <Route
              path=""
              element={
                <SnackbarProvider maxSnack={3}>
                  <Login setUserType={setUserType} />
                </SnackbarProvider>
              }
            />
            <Route
              path="/login"
              element={
                <SnackbarProvider maxSnack={3}>
                  <Login setUserType={setUserType} />
                </SnackbarProvider>
              }
            />
            <Route
              path="/signUp"
              element={
                <SnackbarProvider maxSnack={3}>
                  <SignUp setUserSignedUp={setUserSignedUp} />
                </SnackbarProvider>
              }
            />
            <Route path="/preferences" element={<Preferences />} />
            <Route
              path="/predict_location"
              element={
                loggedInUserRole == "Driver" ? <PredictedLocation /> : <Login />
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </Container>
  );
}

export default App;
