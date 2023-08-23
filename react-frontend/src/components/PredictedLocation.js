import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Rating,
  Icon,
  Label,
  Container,
} from "semantic-ui-react";
import { apiKey } from "../keys";
import axios from "axios";

export const PredictedLocation = () => {
  const [predictedLan, setPredictedLan] = useState(0);
  const [predictedLon, setPredictedLon] = useState(0);
  const [currentLan, setCurrentLan] = useState(0);
  const [currentLon, setCurrentLon] = useState(0);

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLan(latitude);
          setCurrentLon(longitude);
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert("Error getting current location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const [address, setAddress] = useState("");

  const fetchAddress = async () => {
    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${predictedLan},${predictedLon}&key=${apiKey}`;

      const response = await axios.get(apiUrl);

      if (response.data.results.length > 0) {
        setAddress(response.data.results[0].formatted_address);
      } else {
        setAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error fetching address");
    }
  };

  const showInMapClicked = () => {
    // window.open(
    //   "https://maps.google.com?q=" + predictedLan + "," + predictedLon
    // );
    fetchCurrentLocation();
    const baseUrl = "https://www.google.com/maps/dir/";
    const coordsString = `${currentLan},${currentLon}/${predictedLan},${predictedLon}/`;
    const mapsUrl = baseUrl + coordsString;

    window.open(mapsUrl, "_blank");
  };

  var today = new Date();
  // var date =
  //   today.getFullYear() +
  //   "_" +
  //   (today.getMonth() + 1) +
  //   "_" +
  //   today.getDate();
  var weekday = today.getDay();
  var hour = today.getHours();
  // var dateTime = date + "_" + time;
  // console.log(dateTime);
  const dateTime = { weekday, hour };
  console.log(dateTime);
  //extremely important to use await here - Todo
  fetch("/predict_location", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dateTime),
  }).then((response) =>
    response.json().then((data) => {
      console.log("data: ", data);
      console.log("data.predicted_lat[0]: ", data.predicted_lat[0]);
      setPredictedLan(data.predicted_lat[0]);
      setPredictedLon(data.predicted_lon[0]);
    })
  );
  console.log("predictedLan :", predictedLan);
  fetchAddress();

  return (
    <Container>
      <Button as="div" labelPosition="right">
        <Button icon onClick={showInMapClicked}>
          <Icon name="location arrow" />
          Predicted Location
        </Button>
        <Label as="a" basic pointing="left">
          {address}
        </Label>
      </Button>
    </Container>
  );
};
