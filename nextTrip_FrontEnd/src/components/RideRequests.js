import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Label } from "semantic-ui-react";
import io from "socket.io-client";

import { fetchAddress } from "./utils/locationApi";
import { fetchCurrentLocation, openJourney } from "./utils/utils";

const socket = io("http://localhost:5000");

export default function RideRequests() {
  const [rideRequests, setRideRequests] = useState([]);
  const [pickupAddress, setPickupAddress] = useState();
  const [destinationAddress, setDestinationAddress] = useState();
  const [rideAccepted, setRideAccepted] = useState(null);
  const [selectedTab, setSelectedTab] = useState("rideRequests");
  const [reqRidebuttonClicked, setReqRideButtonClicked] = useState(false);
  const [newRequestReceived, setNewRequestReceived] = useState(false);

  useEffect(() => {
    //listen to ride requests
    socket.on("new_ride_request", async (data) => {
      var requestPickupAddress = pickupAddress;
      var requestDestinationAddress = destinationAddress;

      setNewRequestReceived(true);

      await fetchAddress(data.pickupLan, data.pickupLon, (pickupAddress) => {
        setPickupAddress(pickupAddress);
        requestPickupAddress = pickupAddress;
      });
      await fetchAddress(
        data.destinationLan,
        data.destinationLon,
        (destinationAddress) => {
          setDestinationAddress(destinationAddress);
          requestDestinationAddress = destinationAddress;
        }
      );

      setRideRequests((prevRequests) => [
        { ...data, requestPickupAddress, requestDestinationAddress },
        ...prevRequests,
      ]);
    });
    // Clean up event listener on component unmount
    return () => {
      socket.off("new_ride_request");
    };
  }, []);

  const [currentLan, setCurrentLan] = useState(0);
  const [currentLon, setCurrentLon] = useState(0);

  useEffect(() => {
    fetchCurrentLocation(setCurrentLan, setCurrentLon);
  }, []);

  useEffect(() => {
    if (newRequestReceived) {
      setRideAccepted(rideAccepted + 1);
      setNewRequestReceived(false);
    }
  }, [newRequestReceived]);

  const handleAcceptClick = (index, destLan, destLon) => {
    setReqRideButtonClicked(true);
    setRideAccepted(index);
    openJourney(destLan, destLon, currentLan, currentLon);
  };

  const tabs = {
    heatMap: "heatMap",
    todayInsights: "todayInsights",
    dataInsights: "dataInsights",
    account: "account",
    driverMain: "driverMain",
    rideRequests: "rideRequests",
  };

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
          <Link to="/predict_location">
            <button
              id="driverMainTab"
              class="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none"
              onClick={() => selectTabHandle(tabs.driverMain)}
            >
              Home
            </button>
          </Link>
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
          <button
            id="accountTab"
            class="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none"
            onClick={() => selectTabHandle(tabs.account)}
          >
            Account
          </button>
        </nav>
      </div>

      <div>
        {rideRequests.map((request, index) => (
          <div
            key={index}
            className="flex items-center justify-center bg-blue-400 text-white p-4 rounded-lg shadow-md m-2"
          >
            <div className="m-2">
              <h3>Ride Request {index + 1}</h3>
              <div>
                <strong>Date and Time:</strong> {request.dateTime}
              </div>
              <div>
                <strong>Destination Location:</strong>
                <div>
                  {parseFloat(request.destinationLan).toFixed(3)},{"\n"}
                  {parseFloat(request.destinationLon).toFixed(3)}
                </div>
              </div>
              <div>
                <strong>Pickup Location:</strong>
                <div>
                  {parseFloat(request.pickupLan).toFixed(3)},{"\n"}
                  {parseFloat(request.pickupLon).toFixed(3)}
                </div>
              </div>
              <div>
                <strong>User Name:</strong> {request.userName}
              </div>
              <Button
                style={{ margin: "0", padding: "0" }}
                as="div"
                labelPosition="right"
              >
                <Button
                  icon
                  onClick={() => handleAcceptClick(index)}
                  style={{
                    backgroundColor:
                      reqRidebuttonClicked && rideAccepted === index
                        ? "#32CD32"
                        : "#ADD8E6",
                  }}
                >
                  <Icon name="location arrow" />
                  {reqRidebuttonClicked && rideAccepted === index
                    ? "Ride accepted"
                    : "Accept Ride"}
                </Button>
                <Label as="a" basic pointing="left">
                  <Button icon>
                    <div>
                      <Icon name="map marker alternate" />
                    </div>
                    <div className="rounded-lg  bg-gray-200 p-1 mb-1">
                      Pickup:
                    </div>
                    {console.log("request :", request)}
                    {request.requestPickupAddress}
                  </Button>
                  <Button icon>
                    <div>
                      <Icon name="map marker " />
                    </div>
                    <div className="rounded-lg  bg-gray-200 p-1 mb-1">
                      Destination:
                    </div>
                    {request.requestDestinationAddress}
                  </Button>
                </Label>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
