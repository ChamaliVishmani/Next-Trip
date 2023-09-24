import React, { useState, useEffect, useRef } from "react";
import { MarkerF, GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import { googleMapsApiKey } from "../keys";
import { fetchAddress } from "./utils/locationApi";
import { Button, Icon, Label } from "semantic-ui-react";
import { fetchCurrentLocation } from "./utils/utils";
import { updateRidesDB } from "./utils/ridesApi";

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

  const [showPickupMap, setShowPickupMap] = useState();
  const [showDestinationpMap, setShowDestinationMap] = useState();

  const [currentLan, setCurrentLan] = useState(0);
  const [currentLon, setCurrentLon] = useState(0);

  const [map, setMap] = useState(null);
  const initialZoom = 12;
  const markerRef = useRef(null);

  const handleRideRequest = () => {
    updateRidesDB(pickupLocation.lat(), pickupLocation.lng());
  };

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
    setPickupLocation(args[0].latLng);
  }

  function onDestinationDragEnd(...args) {
    setDestinationLocation(args[0].latLng);
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

  return (
    <div className="rounded-lg h-screen bg-blue-500 m-4">
      {isLoaded && destinationLocation && pickupLocation && (
        <div class="bg-white rounded-lg mt-4 p-0 text-black">
          <Button
            style={{ margin: "0", padding: "0" }}
            as="div"
            labelPosition="right"
          >
            <Button icon onClick={handleRideRequest}>
              <Icon name="location arrow" />
              Request Ride
            </Button>
            <Label as="a" basic pointing="left">
              <Button icon onClick={pickupLocationHandle}>
                <Icon name="location arrow" />
                Pickup: {pickupLocationAddress}
              </Button>
              <Button icon onClick={destinationLocationHandle}>
                <Icon name="location arrow" />
                Destination: {destinationLocationAddress}
              </Button>
            </Label>
          </Button>
        </div>
      )}

      {showPickupMap && (
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

      {showDestinationpMap && (
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
