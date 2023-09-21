import React, { useState, useEffect, useRef } from "react";
import { MarkerF, GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import { googleMapsApiKey } from "../keys";
import { fetchAddress } from "./utils/locationApi";

const mapContainerStyle = {
  width: "300px",
  height: "300px",
};

const center = {
  // New York Coordinates
  lat: 40.7128,
  lng: -74.006,
};

const RequestRide = () => {
  const [pickupLocation, setPickupLocation] = useState();
  const [pickupLocationAddress, setPickupLocationAddress] = useState();
  const [map, setMap] = useState(null);
  const initialZoom = 12;
  const markerRef = useRef(null);

  const handleLocationChange = (newLocation) => {
    setPickupLocation(newLocation);
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

  function onDragEnd(...args) {
    console.log("onDragEnd args: ", args[0].latLng.lat());
    // console.log(
    //   markerRef.current.position.lat(),
    //   markerRef.current.position.lng()
    // );
    // setLocation({
    //   lat: markerRef.current.position.lat(),
    //   lng: markerRef.current.position.lng(),
    // });
    setPickupLocation(args[0].latLng);
  }
  useEffect(() => {
    if (isLoaded) {
      let newyork = new window.google.maps.LatLng(center.lat, center.lng);
      setPickupLocation(newyork);
      console.log("location ", pickupLocation);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (pickupLocation) {
      fetchAddress(
        pickupLocation.lat(),
        pickupLocation.lng(),
        setPickupLocationAddress
      );
    }
  }, [pickupLocation]);

  return (
    <div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={initialZoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onChange={handleLocationChange}
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
              onCursorChanged={handleLocationChange}
              onDrag={onDragEnd}
            />
          )}
        </GoogleMap>
      ) : (
        <div>Loading map...</div>
      )}

      {pickupLocation && (
        <>
          <p>
            Selected pickup location: {pickupLocation.lat()},{" "}
            {pickupLocation.lng()}
          </p>
          <p>Selected pickup location Address: {pickupLocationAddress}</p>
        </>
      )}
    </div>
  );
};

export default RequestRide;
