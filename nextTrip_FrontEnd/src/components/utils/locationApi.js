import axios from "axios";

import { positionStackAPIKey } from "../../keys";

export async function fetchAddress(lan, lon, setAddress) {
  try {
    console.log("lan sent to address :", lan, "lon sent to address :", lon);
    const apiUrl = `http://api.positionstack.com/v1/reverse?access_key=${positionStackAPIKey}&query=${lan},${lon}&limit=1`;

    const response = await axios.get(apiUrl);
    if (response.data.data.length > 0) {
      setAddress(response.data.data[0].label);
    } else {
      setAddress("Address not found");
    }
  } catch (error) {
    setAddress("Error fetching address");
  }
}

export async function predictDestinationAll(setPredictedLan, setPredictedLon) {
  var today = new Date();
  var weekday = today.getDay();
  var hour = today.getHours();
  const dateTime = { weekday, hour };

  try {
    const apiUrl = `http://localhost:5000/predict_location/allLocations`;

    const response = await axios
      .post(apiUrl, JSON.stringify(dateTime), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setPredictedLan(response.data.predicted_lat);
        setPredictedLon(response.data.predicted_lon);
      });
  } catch (error) {
    console.log("err :", error);
  }
}

export async function predictDestinationHere(
  currentLan,
  currentLon,
  setPredictedLan,
  setPredictedLon
) {
  var today = new Date();
  var weekday = today.getDay();
  var hour = today.getHours();
  var lat = currentLan;
  var lon = currentLon;
  const requestBody = { weekday, hour, lat, lon };

  try {
    const apiUrl = `http://localhost:5000/predict_location/closeLocations`;

    const response = await axios
      .post(apiUrl, JSON.stringify(requestBody), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setPredictedLan(response.data.predicted_lat);
        setPredictedLon(response.data.predicted_lon);
      });
  } catch (error) {
    console.log("err :", error);
  }
}

// Heat Map

export function setHeatMapDataPointsFunc(
  heatmapData,
  setHeatMapDataPoints,
  setTopFiveLocations
) {
  var heatMapDataPointsToSet = heatmapData.map(function (point) {
    const location = new window.google.maps.LatLng(point.Lat, point.Lon);

    return {
      location: location,
      weight: point.weight * 100,
    };
  });
  setHeatMapDataPoints(heatMapDataPointsToSet);

  // get top locations

  if (
    Array.isArray(heatMapDataPointsToSet) &&
    heatMapDataPointsToSet.length > 0 &&
    heatMapDataPointsToSet[0].hasOwnProperty("weight")
  ) {
    heatMapDataPointsToSet.sort((a, b) => b.weight - a.weight);
    const topFiveLocationsToSet = heatMapDataPointsToSet.slice(0, 5);
    setTopFiveLocations(topFiveLocationsToSet);
  } else {
    console.error("heatmapDataPoints is not an array.");
  }
}

export async function getHeatMapData(
  setHeatMapData,
  heatmapData,
  setHeatMapDataPoints,
  setTopFiveLocations
) {
  var today = new Date();
  var weekday = today.getDay();
  var hour = today.getHours();
  const dateTime = { weekday, hour };

  try {
    const apiUrl = `http://localhost:5000/heatmap_data`;

    const response = await axios
      .post(apiUrl, JSON.stringify(dateTime), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        const data = response.data.heatmap_data;
        if (data) {
          setHeatMapData(response.data.heatmap_data);
          setHeatMapDataPointsFunc(
            heatmapData,
            setHeatMapDataPoints,
            setTopFiveLocations
          );
        }
      });
  } catch (error) {
    console.log("err :", error);
  }
}

export async function getTodayData(setTodayHrCount) {
  var today = new Date();
  var weekday = today.getDay();
  const date = { weekday };

  try {
    const apiUrl = `http://localhost:5000/count_data/by_dayHr`;

    const response = await axios
      .post(apiUrl, JSON.stringify(date), {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        const data = response.data.dayHrcount_data;
        if (data) {
          setTodayHrCount(response.data.dayHrcount_data);
        }
      });
  } catch (error) {
    console.log("err :", error);
  }
}

export async function getDayCountData(setDailyCount) {
  try {
    const apiUrl = `http://localhost:5000/count_data/by_day`;

    const response = await axios.get(apiUrl).then((response) => {
      setDailyCount(response.data.daycount_data);
    });
  } catch (error) {
    console.log("err :", error);
  }
}
