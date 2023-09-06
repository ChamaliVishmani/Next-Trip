import React, { useEffect, useState } from "react";
import { Button, Icon, Label, Container } from "semantic-ui-react";
import { apiKey } from "../keys.js";
import axios from "axios";

//todo : start journey when go to maps-> add new entry to db -> on cancel , remove new entry
// update model every 1 hour

export const PredictedLocation = () => {
  const [predictedLan, setPredictedLan] = useState(0);
  const [predictedLon, setPredictedLon] = useState(0);
  const [currentLan, setCurrentLan] = useState(0);
  const [currentLon, setCurrentLon] = useState(0);
  const [predictedAddress, setPredictedAddress] = useState("");

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLan(latitude);
          setCurrentLon(longitude);
        },
        (error) => {
          console.log("Error getting current location.", error);
          alert("Error getting current location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const fetchPredictedDestinationAddress = async () => {
    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${predictedLan},${predictedLon}&key=${apiKey}`;

      const response = await axios.get(apiUrl);

      if (response.data.results.length > 0) {
        setPredictedAddress(response.data.results[0].formatted_address);
      } else {
        setPredictedAddress("Address not found");
      }
    } catch (error) {
      setPredictedAddress("Error fetching address");
    }
  };

  const openPredictedLocationJourney = () => {
    fetchCurrentLocation();
    const baseUrl = "https://www.google.com/maps/dir/";
    const coordsString = `${currentLan},${currentLon}/${predictedLan},${predictedLon}/`;
    const mapsUrl = baseUrl + coordsString;
    window.open(mapsUrl, "_blank");
  };

  const predictDestination = async () => {
    var today = new Date();
    var weekday = today.getDay();
    var hour = today.getHours();
    const dateTime = { weekday, hour };

    try {
      const apiUrl = `http://localhost:5000/predict_location`;

      const response = await axios
        .post(apiUrl, JSON.stringify(dateTime), {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          // response.json().then((data) => {
          //   setPredictedLan(data.predicted_lat[0]);
          //   setPredictedLon(data.predicted_lon[0]);
          // });

          setPredictedLan(response.data.predicted_lat);
          setPredictedLon(response.data.predicted_lon);
        });

      fetchPredictedDestinationAddress();
    } catch (error) {
      console.log("err :", error);
    }
  };

  // const predictDestination = async () => {
  //   var today = new Date();
  //   var weekday = today.getDay();
  //   var hour = today.getHours();
  //   const dateTime = { weekday, hour };

  //   await fetch("/predict_location", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(dateTime),
  //   }).then((response) =>
  //     response.json().then((data) => {
  //       setPredictedLan(data.predicted_lat[0]);
  //       setPredictedLon(data.predicted_lon[0]);
  //     })
  //   );

  //   fetchPredictedDestinationAddress();
  // };

  useEffect(() => {
    predictDestination();
    fetchCurrentLocation();
  }, [predictedLan, predictedLon]);

  return (
    <Container>
      <Button
        as="div"
        labelPosition="right"
        onClick={openPredictedLocationJourney}
      >
        <Button icon>
          <Icon name="location arrow" />
          Predicted Destination
        </Button>
        <Label as="a" basic pointing="left">
          {predictedAddress}
        </Label>
      </Button>
    </Container>
  );
};
