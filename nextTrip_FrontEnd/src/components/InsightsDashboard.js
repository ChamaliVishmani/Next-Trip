import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  GoogleMap,
  useJsApiLoader,
  HeatmapLayerF,
} from "@react-google-maps/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { apiKey } from "../keys.js";
import { Container } from "semantic-ui-react";

const containerStyle = {
  width: "400px",
  height: "400px",
};

const center = {
  // New York Coordinates
  lat: 40.7128,
  lng: -74.006,
};

export default function InsightsDashboard() {
  const [heatmapData, setHeatMapData] = useState();
  const [heatmapDataPoints, setHeatMapDataPoints] = useState("");
  const [map, setMap] = useState(null);

  const [hourlyCount, setHourlyCount] = useState();
  const [hourlyCountPoints, setHourlyCountPoints] = useState();

  const setHeatMapDataPointsFunc = () => {
    var heatMapDataPointsToSet = heatmapData.map(function (point) {
      const location = new window.google.maps.LatLng(point.Lat, point.Lon);

      return {
        location: location,
        weight: point.weight * 100,
      };
    });
    setHeatMapDataPoints(heatMapDataPointsToSet);
  };

  const getHeatMapData = async () => {
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
            setHeatMapDataPointsFunc();
          }
        });
    } catch (error) {
      console.log("err :", error);
    }
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ["visualization"],
  });

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    // Initial data fetch
    getHeatMapData();

    // Fetch data every hour
    const intervalId = setInterval(getHeatMapData, 3600000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (heatmapData) {
      setHeatMapDataPointsFunc();
    }
  }, [heatmapData]);
  /////

  useEffect(() => {
    getHourCountData();
  }, []);

  useEffect(() => {
    if (hourlyCount) {
      modifyHourlycountHours();
    }
  }, [hourlyCount]);

  const getHourCountData = async () => {
    try {
      const apiUrl = `http://localhost:5000/count_data/by_hour`;

      const response = await axios.get(apiUrl).then((response) => {
        // const data = response.data.heatmap_data;
        // if (data) {
        //   setHeatMapData(response.data.heatmap_data);
        //   setHeatMapDataPointsFunc();
        // }
        setHourlyCount(response.data.hourcount_data);
        console.log("res : ", response);
      });
    } catch (error) {
      console.log("err :", error);
    }
  };

  const modifyHourlycountHours = () => {
    const modifiedHourlyCount = hourlyCount.map((dataPoint) => ({
      ...dataPoint,
      hour: dataPoint.hour + 1,
    }));
    setHourlyCountPoints(modifiedHourlyCount);
  };

  return (
    <>
      <Container>
        {isLoaded ? (
          <>
            {heatmapDataPoints && heatmapDataPoints.length > 0 ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                <HeatmapLayerF data={heatmapDataPoints} />
              </GoogleMap>
            ) : (
              <div>Loading heatmap data...</div>
            )}
          </>
        ) : (
          <div>Loading...</div>
        )}
      </Container>
      <Container>
        {hourlyCount && hourlyCount.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={500}
              height={300}
              data={hourlyCountPoints}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              {console.log("hourlyCount : ", hourlyCount, " length array :")}
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" interval={1} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div>Loading chart data...</div>
        )}
      </Container>
    </>
  );
}
