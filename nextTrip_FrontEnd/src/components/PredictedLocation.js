import React, { useEffect, useState } from "react";
import { Button, Icon, Label, Container } from "semantic-ui-react";

import { predictDestination } from "./utils/locationApi.js";
import { fetchCurrentLocation, openJourney } from "./utils/utils.js";

//todo : start journey when go to maps-> add new entry to db -> on cancel , remove new entry
// update model every 1 hour

export const PredictedLocation = () => {
  const [predictedLan, setPredictedLan] = useState(0);
  const [predictedLon, setPredictedLon] = useState(0);
  const [currentLan, setCurrentLan] = useState(0);
  const [currentLon, setCurrentLon] = useState(0);
  const [predictedAddress, setPredictedAddress] = useState("");

  const handleButtonClick = () => {
    openJourney(predictedLan, predictedLon, currentLan, currentLon);
  };

  useEffect(() => {
    predictDestination(
      predictedLan,
      predictedLon,
      setPredictedLan,
      setPredictedLon,
      setPredictedAddress
    );

    fetchCurrentLocation(setCurrentLan, setCurrentLon);
  }, [predictedLan, predictedLon]);

  return (
    <Container>
      <Button as="div" labelPosition="right" onClick={handleButtonClick}>
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
