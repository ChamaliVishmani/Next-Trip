import React, { useState, useEffect, useRef } from "react";
import { MarkerF, GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import { googleMapsApiKey } from "../keys";

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
  const [location, setLocation] = useState();
  const [map, setMap] = useState(null);
  const initialZoom = 12;
  const markerRef = useRef(null);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
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
    setLocation(args[0].latLng);
  }
  useEffect(() => {
    if (isLoaded) {
      let newyork = new window.google.maps.LatLng(center.lat, center.lng);
      setLocation(newyork);
      console.log("location ", location);
    }
  }, [isLoaded]);

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
          {location && (
            <MarkerF
              position={location}
              draggable
              onCursorChanged={handleLocationChange}
              onDrag={onDragEnd}
            />
          )}
        </GoogleMap>
      ) : (
        <div></div>
      )}

      {location && (
        <p>
          Selected location: {location.lat()}, {location.lng()}
        </p>
      )}
    </div>
  );
};

export default RequestRide;
