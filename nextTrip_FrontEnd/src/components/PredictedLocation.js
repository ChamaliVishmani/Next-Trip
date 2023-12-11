import React, { useEffect, useState } from "react";
import { Button, Icon, Label } from "semantic-ui-react";

import {
  fetchAddress,
  predictDestinationAll,
  predictDestinationHere,
} from "./utils/locationApi.js";
import { fetchCurrentLocation, openJourney } from "./utils/utils.js";
import { Link } from "react-router-dom";

export const PredictedLocation = () => {
  const [predictedLanAll, setPredictedLanAll] = useState(0);
  const [predictedLonAll, setPredictedLonAll] = useState(0);
  const [currentLan, setCurrentLan] = useState(0);
  const [currentLon, setCurrentLon] = useState(0);
  const [predictedAddressAll, setPredictedAddressAll] = useState("");

  const [predictedLanHere, setPredictedLanHere] = useState(0);
  const [predictedLonHere, setPredictedLonHere] = useState(0);
  const [predictedAddressHere, setPredictedAddressHere] = useState("");

  const handleButtonClickAll = () => {
    openJourney(predictedLanAll, predictedLonAll, currentLan, currentLon);
  };

  const handleButtonClickHere = () => {
    openJourney(predictedLanHere, predictedLonHere, currentLan, currentLon);
  };

  useEffect(() => {
    predictDestinationAll(setPredictedLanAll, setPredictedLonAll);

    fetchCurrentLocation(setCurrentLan, setCurrentLon);
  }, []);

  useEffect(() => {
    fetchAddress(predictedLanAll, predictedLonAll, setPredictedAddressAll);
  }, [predictedLanAll, predictedLonAll]);

  useEffect(() => {
    predictDestinationHere(
      currentLan,
      currentLon,
      setPredictedLanHere,
      setPredictedLonHere
    );
  }, [currentLan, currentLon]);

  useEffect(() => {
    fetchAddress(predictedLanHere, predictedLonHere, setPredictedAddressHere);
  }, [predictedLanHere, predictedLonHere]);

  const tabs = {
    heatMap: "heatMap",
    todayInsights: "todayInsights",
    dataInsights: "dataInsights",
    driverMain: "driverMain",
    rideRequests: "rideRequests",
  };

  const [, setSelectedTab] = useState("heatMap");

  const selectTabHandle = (tab) => {
    const tabElements = document.querySelectorAll("button");
    tabElements.forEach((tabElement) => {
      tabElement.classList.remove("border-b-2", "border-blue-500");
      tabElement.style.color = "gray";
    });

    const selectedTabElement = document.getElementById(`${tab}Tab`);
    selectedTabElement.classList.add("border-b-2", "border-blue-500");
    selectedTabElement.style.color = "blue";

    setSelectedTab(tab);
  };

  return (
    <div className="rounded-lg h-screen bg-blue-500 m-4">
      <div class="bg-white rounded-lg">
        <nav class="flex justify-between">
          <button
            id="driverMainTab"
            class="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none text-blue-500 border-b-2 font-medium border-blue-500"
            onClick={() => selectTabHandle(tabs.driverMain)}
          >
            Predicted Location
          </button>
          <Link to="/rideRequests">
            <button
              id="rideRequestsTab"
              class="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none"
              onClick={() => selectTabHandle(tabs.rideRequests)}
            >
              Ride Requests
            </button>
          </Link>
          <Link to="/insights">
            <button
              id="todayInsightsTab"
              class="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none"
              onClick={() => selectTabHandle(tabs.todayInsights)}
            >
              Insights Dashboard
            </button>
          </Link>
        </nav>
      </div>
      <div class="bg-white rounded-lg mt-4 p-0">
        <Button
          style={{ margin: "0", padding: "0" }}
          as="div"
          labelPosition="right"
          onClick={handleButtonClickHere}
        >
          <Button icon>
            <Icon name="location arrow" />
            Predicted Destination For Your Location
          </Button>
          <Label as="a" basic pointing="left">
            {predictedAddressHere}
          </Label>
          <Label as="a" basic pointing="left">
            {parseFloat(predictedLanHere).toFixed(3)},{"\n"}
            {parseFloat(predictedLonHere).toFixed(3)}
          </Label>
        </Button>
      </div>
      <div class="bg-white rounded-lg mt-4 p-0">
        <Button
          style={{ margin: "0", padding: "0" }}
          as="div"
          labelPosition="right"
          onClick={handleButtonClickAll}
        >
          <Button icon>
            <Icon name="location arrow" />
            Predicted Destination
          </Button>
          <Label as="a" basic pointing="left">
            {predictedAddressAll}
          </Label>
          <Label as="a" basic pointing="left">
            {parseFloat(predictedLanAll).toFixed(3)},{"\n"}
            {parseFloat(predictedLonAll).toFixed(3)}
          </Label>
        </Button>
      </div>
    </div>
  );
};
