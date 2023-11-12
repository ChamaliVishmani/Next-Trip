import React, { useEffect, useState } from "react";
import { Button, Icon, Label, Container } from "semantic-ui-react";

import { predictDestination } from "./utils/locationApi.js";
import { fetchCurrentLocation, openJourney } from "./utils/utils.js";
import { Link } from "react-router-dom";

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
  }, []);

  const tabs = {
    heatMap: "heatMap",
    todayInsights: "todayInsights",
    dataInsights: "dataInsights",
    account: "account",
    driverMain: "driverMain",
  };

  const [selectedTab, setSelectedTab] = useState("heatMap");

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
            Home
          </button>
          <Link to="/insights">
            <button
              id="todayInsightsTab"
              class="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none"
              onClick={() => selectTabHandle(tabs.todayInsights)}
            >
              Insights Dashboard
            </button>
          </Link>
          <button
            id="accountTab"
            class="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none"
            onClick={() => selectTabHandle(tabs.account)}
          >
            Account
          </button>
        </nav>
      </div>
      <div class="bg-white rounded-lg mt-4 p-0">
        <Button
          style={{ margin: "0", padding: "0" }}
          as="div"
          labelPosition="right"
          onClick={handleButtonClick}
        >
          <Button icon>
            <Icon name="location arrow" />
            Predicted Destination
          </Button>
          <Label as="a" basic pointing="left">
            {predictedAddress}
          </Label>
        </Button>
      </div>
    </div>
  );
};
