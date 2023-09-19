import React, { useEffect, useState } from "react";
import { Button, Icon, Label, Container } from "semantic-ui-react";

import { predictDestination } from "./utils/locationApi.js";

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

  const openPredictedLocationJourney = () => {
    fetchCurrentLocation();
    const baseUrl = "https://www.google.com/maps/dir/";
    const coordsString = `${currentLan},${currentLon}/${predictedLan},${predictedLon}/`;
    const mapsUrl = baseUrl + coordsString;
    window.open(mapsUrl, "_blank");
  };

  useEffect(() => {
    predictDestination(
      predictedLan,
      predictedLon,
      setPredictedLan,
      setPredictedLon,
      setPredictedAddress
    );
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
