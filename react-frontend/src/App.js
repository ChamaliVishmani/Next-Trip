// import { useEffect, useState } from "react";
import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Movies } from "./components/Movies";
// import { MovieForm } from "./components/MovieForm";
import { Container } from "semantic-ui-react";
import { PredictedLocation } from "./components/PredictedLocation";
import { Helmet } from "react-helmet";
import Dashboard from "./components/Dashboard";
import Preferences from "./components/Preferences";
import Login from "./components/Login/Login";
import useToken from "./useToken";

function App() {
  //test
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />;
  }
  // const [movies, setMovies] = useState([]);
  // const [predictedLan, setPredictedLan] = useState(0);

  // const getLocation = async () => {
  //   var today = new Date();
  //   // var date =
  //   //   today.getFullYear() +
  //   //   "_" +
  //   //   (today.getMonth() + 1) +
  //   //   "_" +
  //   //   today.getDate();
  //   var weekday = today.getDay();
  //   var hour = today.getHours();
  //   // var dateTime = date + "_" + time;
  //   // console.log(dateTime);
  //   const dateTime = { weekday, hour };
  //   console.log(dateTime);
  //   await fetch("/predict_location", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(dateTime),
  //   }).then((response) =>
  //     response.json().then((data) => {
  //       console.log("data: ", data);
  //       console.log("data.predicted_lat[0]: ", data.predicted_lat[0]);
  //       setPredictedLan(data.predicted_lat[0]);
  //     })
  //   );
  //   console.log("predictedLan :", predictedLan);
  // };

  // useEffect(() => {
  //   fetch("/movies").then((response) =>
  //     response.json().then((data) => {
  //       setMovies(data.movies);
  //     })
  //   );
  //   // GetLocation();
  // }, []);

  // useEffect(() => {
  //   var today = new Date();
  //   // var date =
  //   //   today.getFullYear() +
  //   //   "_" +
  //   //   (today.getMonth() + 1) +
  //   //   "_" +
  //   //   today.getDate();
  //   var weekday = today.getDay();
  //   var hour = today.getHours();
  //   // var dateTime = date + "_" + time;
  //   // console.log(dateTime);
  //   const dateTime = { weekday, hour };
  //   console.log(dateTime);
  //   fetch("/predict_location", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(dateTime),
  //   }).then((response) =>
  //     response.json().then((data) => {
  //       console.log(data);
  //       setPredicted_location([data.predicted_lat, data.predicted_lon]);
  //     })
  //   );
  //   console.log("prediction :", predicted_location);
  // }, []);
  // setInterval(GetLocation, 1 * 60 * 1000); //1 min
  // const response = await fetch("/add_movie", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify(movie),
  //           });
  //           if (response.ok) {
  //             console.log("response worked!");
  //             onNewMovie(movie);
  //             setTitle("");
  //             setRating(1);
  //           }

  return (
    // <Container style={{ marginTop: 40 }}>
    //   <Helmet>
    //     <title>Next Trip</title>
    //   </Helmet>
    //   {/* <MovieForm
    //     onNewMovie={(movie) =>
    //       setMovies((currentMovies) => [movie, ...currentMovies])
    //     }
    //   /> */}
    //   {/* <Movies movies={movies} /> */}
    //   <PredictedLocation />
    //   {/* <GetLocation /> */}
    // </Container>

    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/predict_location" element={<PredictedLocation />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
