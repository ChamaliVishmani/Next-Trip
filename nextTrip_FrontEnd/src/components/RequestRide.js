import React, { useState, useEffect, useRef } from "react";
import { MarkerF, GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Button, Icon, Label } from "semantic-ui-react";
import io from "socket.io-client";

import { googleMapsApiKey } from "../keys";
import { fetchAddress } from "./utils/locationApi";
import { fetchCurrentLocation } from "./utils/utils";
import { requestRide, updateRidesDB } from "./utils/ridesApi";

const mapContainerStyle = {
  width: "300px",
  height: "300px",
};

const RequestRide = () => {
  const [pickupLocation, setPickupLocation] = useState();
  const [pickupLocationAddress, setPickupLocationAddress] = useState();

  const [destinationLocation, setDestinationLocation] = useState();
  const [destinationLocationAddress, setDestinationLocationAddress] =
    useState();

  const [driverAddress, setDriverAddress] = useState();

  const [showPickupMap, setShowPickupMap] = useState();
  const [showDestinationpMap, setShowDestinationMap] = useState();

  const [currentLan, setCurrentLan] = useState(0);
  const [currentLon, setCurrentLon] = useState(0);

  const [reqRidebuttonClicked, setReqRideButtonClicked] = useState(false);
  const [rideAccepted, setRideAccepted] = useState(false);
  const [rideAcceptedData, setRideAcceptedData] = useState(null);

  const [map, setMap] = useState(null);
  const initialZoom = 12;

  const [requestedRide, setRequestedRide] = useState(false);

  const socket = io("http://localhost:5000");

  useEffect(() => {
    //listen to ride accept
    socket.on("ride_accept", async (data) => {
      console.log("ride accept data :", data);

      const requestedRideStored = JSON.parse(
        sessionStorage.getItem("requestedRide")
      );
      console.log("ride request data :", requestedRideStored);
      if (
        data.accepted &&
        requestedRideStored &&
        data.userName === sessionStorage.getItem("userName") &&
        data.pickupLan === requestedRideStored.pickupLocation.lat &&
        data.pickupLon === requestedRideStored.pickupLocation.lng &&
        data.destinationLan === requestedRideStored.destinationLocation.lat &&
        data.destinationLon === requestedRideStored.destinationLocation.lng
      ) {
        setRideAccepted(true);
        setRideAcceptedData(data);
        console.log("ride accepted");
      }
    });
    // Clean up event listener on component unmount
    return () => {
      socket.off("ride_accept");
    };
  }, []);

  const handleRideRequest = () => {
    if (!reqRidebuttonClicked) {
      setReqRideButtonClicked(true);
      updateRidesDB(pickupLocation.lat(), pickupLocation.lng());
      requestRide(
        pickupLocation.lat(),
        pickupLocation.lng(),
        destinationLocation.lat(),
        destinationLocation.lng(),
        sessionStorage.getItem("userName")
      );
      setRequestedRide({
        pickupLocation,
        destinationLocation,
        userName: sessionStorage.getItem("userName"),
      });
    }
  };

  useEffect(() => {
    if (requestedRide && setReqRideButtonClicked) {
      sessionStorage.setItem("requestedRide", JSON.stringify(requestedRide));
    }
  }, [requestedRide]);

  const handlePickupLocationChange = (newLocation) => {
    setPickupLocation(newLocation);
  };

  const handleDestinationLocationChange = (newLocation) => {
    setDestinationLocation(newLocation);
  };

  const pickupLocationHandle = () => {
    fetchCurrentLocation(setCurrentLan, setCurrentLon);
    let currentLocation = new window.google.maps.LatLng(currentLan, currentLon);
    setPickupLocation(currentLocation);
    setDestinationLocation(currentLocation);
    setShowPickupMap(true);
    setShowDestinationMap(false);
  };

  const destinationLocationHandle = () => {
    setShowDestinationMap(true);
    setShowPickupMap(false);
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey,
    libraries: ["visualization"],
  });

  const onLoad = React.useCallback(
    function callback(map) {
      if (isLoaded) {
        map.setZoom(initialZoom);

        setMap(map);
      }
    },
    [isLoaded]
  );

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  function onPickupDragEnd(...args) {
    if (!reqRidebuttonClicked) {
      setPickupLocation(args[0].latLng);
    }
  }

  function onDestinationDragEnd(...args) {
    if (!reqRidebuttonClicked) {
      setDestinationLocation(args[0].latLng);
    }
  }

  useEffect(() => {
    if (isLoaded) {
      fetchCurrentLocation(setCurrentLan, setCurrentLon);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (currentLan && currentLon) {
      let currentLocation = new window.google.maps.LatLng(
        currentLan,
        currentLon
      );
      setPickupLocation(currentLocation);
      setDestinationLocation(currentLocation);
    }
  }, [currentLan, currentLon]);

  useEffect(() => {
    if (pickupLocation) {
      fetchAddress(
        pickupLocation.lat(),
        pickupLocation.lng(),
        setPickupLocationAddress
      );
    }
  }, [pickupLocation]);

  useEffect(() => {
    if (destinationLocation) {
      fetchAddress(
        destinationLocation.lat(),
        destinationLocation.lng(),
        setDestinationLocationAddress
      );
    }
  }, [destinationLocation]);

  useEffect(() => {
    if (
      rideAccepted &&
      rideAcceptedData.driverLan &&
      rideAcceptedData.driverLon
    ) {
      fetchAddress(
        rideAcceptedData.driverLan,
        rideAcceptedData.driverLon,
        setDriverAddress
      );
    }
  }, [rideAccepted, rideAcceptedData]);

  return (
    <div className="rounded-lg h-screen bg-blue-500 m-4 ">
      {isLoaded && destinationLocation && pickupLocation && (
        <>
          <div class="bg-white rounded-lg mt-4 p-0 text-black ">
            <Button
              style={{ margin: "0", padding: "0" }}
              as="div"
              labelPosition="right"
            >
              <Button
                icon
                onClick={handleRideRequest}
                style={{
                  backgroundColor:
                    reqRidebuttonClicked && !rideAccepted
                      ? "#32CD32"
                      : "#ADD8E6",
                }}
              >
                <Icon name="location arrow" />
                {reqRidebuttonClicked ? "Ride requested" : "Request Ride"}
              </Button>
              <Label as="a" basic pointing="left">
                <Button icon onClick={pickupLocationHandle}>
                  <div>
                    <Icon name="map marker alternate" />
                  </div>
                  <div className="rounded-lg  bg-gray-200 p-1 mb-1">
                    Pickup:
                  </div>
                  {pickupLocationAddress}
                </Button>
                <Button icon onClick={destinationLocationHandle}>
                  <div>
                    <Icon name="map marker " />
                  </div>
                  <div className="rounded-lg  bg-gray-200 p-1 mb-1">
                    Destination:
                  </div>
                  {destinationLocationAddress}
                </Button>
              </Label>
            </Button>
          </div>
          <div class="bg-white rounded-lg mt-4 p-0 text-black ">
            <Button
              style={{ margin: "0", padding: "0" }}
              as="div"
              labelPosition="right"
            >
              <Button
                icon
                style={{
                  backgroundColor: "#ADD8E6",
                }}
              >
                <Icon name="location arrow" />
                {"Coordinates:"}
              </Button>
              <Label as="a" basic pointing="left">
                <Button icon onClick={pickupLocationHandle}>
                  <div>
                    <Icon name="map marker alternate" />
                  </div>
                  <div className="rounded-lg  bg-gray-200 p-1 mb-1">
                    Pickup:
                  </div>
                  {parseFloat(pickupLocation.lat()).toFixed(3)},{"\n"}
                  {parseFloat(pickupLocation.lng()).toFixed(3)}
                </Button>
                <Button icon onClick={destinationLocationHandle}>
                  <div>
                    <Icon name="map marker " />
                  </div>
                  <div className="rounded-lg  bg-gray-200 p-1 mb-1">
                    Destination:
                  </div>
                  {parseFloat(destinationLocation.lat()).toFixed(3)},{"\n"}
                  {parseFloat(destinationLocation.lng()).toFixed(3)}
                </Button>
              </Label>
            </Button>
          </div>
        </>
      )}

      {isLoaded && rideAccepted && (
        <div class="bg-white rounded-lg mt-4 p-0 text-black">
          <Button
            style={{ margin: "0", padding: "0" }}
            as="div"
            labelPosition="right"
          >
            <Button
              icon
              style={{
                backgroundColor: "#32CD32",
              }}
            >
              <Icon name="location arrow" />
              Ride accepted
            </Button>
            <Label as="a" basic pointing="left">
              <Button icon>
                <div>
                  <Icon name="map marker alternate" />
                </div>
                <div className="rounded-lg  bg-gray-200 p-1 mb-1">Driver:</div>
                {rideAcceptedData.driverName}
              </Button>
              <Button icon>
                <div>
                  <Icon name="map marker " />
                </div>
                <div className="rounded-lg  bg-gray-200 p-1 mb-1">
                  Driver Location:
                </div>
                {driverAddress}
                {"\n"}
                {rideAcceptedData.driverLan},{"\n"} {rideAcceptedData.driverLon}
              </Button>
            </Label>
          </Button>
        </div>
      )}

      {showPickupMap && !reqRidebuttonClicked && (
        <div className="flex items-center justify-center bg-blue-400 text-white p-4 rounded-lg shadow-md m-2 flex-col">
          <div className="mb-2 flex-col text-xl font-bold ">
            Set your pickup location
          </div>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={pickupLocation}
              zoom={initialZoom}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onChange={handlePickupLocationChange}
              mapType={"satellite"}
              mapOptions={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {pickupLocation && (
                <MarkerF
                  position={pickupLocation}
                  draggable
                  onCursorChanged={handlePickupLocationChange}
                  onDrag={onPickupDragEnd}
                />
              )}
            </GoogleMap>
          ) : (
            <div>Loading map...</div>
          )}
        </div>
      )}

      {showDestinationpMap && !reqRidebuttonClicked && (
        <div className="flex items-center justify-center bg-blue-400 text-white p-4 rounded-lg shadow-md m-2 flex-col">
          <div className="mb-2 flex-col text-xl font-bold ">
            Set your destination
          </div>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={destinationLocation}
              zoom={initialZoom}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onChange={handleDestinationLocationChange}
              mapType={"satellite"}
              mapOptions={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {pickupLocation && (
                <MarkerF
                  position={destinationLocation}
                  draggable
                  onCursorChanged={handleDestinationLocationChange}
                  onDrag={onDestinationDragEnd}
                />
              )}
            </GoogleMap>
          ) : (
            <div>Loading map...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestRide;
