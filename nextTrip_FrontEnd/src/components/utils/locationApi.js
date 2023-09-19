import axios from "axios";

import { apiKey } from "../../keys";

const fetchPredictedDestinationAddress = async (
  predictedLan,
  predictedLon,
  setPredictedAddress
) => {
  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${predictedLan},${predictedLon}&key=${apiKey}`;

    const response = await axios.get(apiUrl);

    if (response.data.results.length > 0) {
      setPredictedAddress(response.data.results[0].formatted_address);
    } else {
      setPredictedAddress("Address not found");
    }
  } catch (error) {
    setPredictedAddress("Error fetching address");
  }
};

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

    fetchPredictedDestinationAddress(
      predictedLan,
      predictedLon,
      setPredictedAddress
    );
  } catch (error) {
    console.log("err :", error);
  }
}
