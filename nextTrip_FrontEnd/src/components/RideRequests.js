import React, { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function RideRequests() {
  useEffect(() => {
    //listen to ride requests
    socket.on("new_ride_request", (data) => {
      console.log("ride request received :", data);
    });
    // Clean up event listener on component unmount
    return () => {
      socket.off("new_ride_request");
    };
  }, []);
  return <h2>Preferences</h2>;
}
