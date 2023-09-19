import axios from "axios";

import { apiKey } from "../../keys";

export async function fetchAddress(lan, lon, setAddress) {
  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lan},${lon}&key=${apiKey}`;

    const response = await axios.get(apiUrl);

    if (response.data.results.length > 0) {
      setAddress(response.data.results[0].formatted_address);
    } else {
      setAddress("Address not found");
    }
  } catch (error) {
    setAddress("Error fetching address");
  }
}

export async function predictDestination(
  predictedLan,
  predictedLon,
  setPredictedLan,
  setPredictedLon,
  setPredictedAddress
) {
  var today = new Date();
  var weekday = today.getDay();
  var hour = today.getHours();
  const dateTime = { weekday, hour };

  try {
    const apiUrl = `http://localhost:5000/predict_location`;

    const response = await axios
      .post(apiUrl, JSON.stringify(dateTime), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setPredictedLan(response.data.predicted_lat);
        setPredictedLon(response.data.predicted_lon);
      });

    fetchAddress(predictedLan, predictedLon, setPredictedAddress);
  } catch (error) {
    console.log("err :", error);
  }
}
