import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  GoogleMap,
  useJsApiLoader,
  HeatmapLayerF,
  MarkerF,
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
  BarChart,
  Bar,
} from "recharts";

import { apiKey } from "../keys.js";
import { Container } from "semantic-ui-react";

const containerStyle = {
  width: "300px",
  height: "300px",
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
  const initialZoom = 12;

  const [hourlyCount, setHourlyCount] = useState();
  const [hourlyCountPoints, setHourlyCountPoints] = useState();
  const [dailyCount, setDailyCount] = useState();
  const [dailyCountPoints, setDailyCountPoints] = useState();

  const [todayHrCount, setTodayHrCount] = useState();
  const [todayHrCountPoints, setTodayHrCountPoints] = useState();

  const [topFiveLocations, setTopFiveLocations] = useState();

  // HeatMap

  const setHeatMapDataPointsFunc = () => {
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
      console.log("heatMapDataPointsToSet sorted", heatMapDataPointsToSet);
      const topFiveLocationsToSet = heatMapDataPointsToSet.slice(0, 5);
      setTopFiveLocations(topFiveLocationsToSet);
      console.log("topFiveLocations", topFiveLocations);
    } else {
      console.error("heatmapDataPoints is not an array.");
    }
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

  // Top 4 locations popup markers

  // heatmapDataPoints.sort((a, b) => b.weight - a.weight);

  // const topFiveLocations = heatmapDataPoints.slice(0, 5).map((item) => ({
  //   Lat: item.Lat,
  //   Lon: item.Lon,
  // }));

  //Stats by Hour

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
        setHourlyCount(response.data.hourcount_data);
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

  // Stats by day

  useEffect(() => {
    getDayCountData();
  }, []);

  useEffect(() => {
    if (dailyCount) {
      modifyDailycountHours();
    }
  }, [dailyCount]);

  const getDayCountData = async () => {
    try {
      const apiUrl = `http://localhost:5000/count_data/by_day`;

      const response = await axios.get(apiUrl).then((response) => {
        setDailyCount(response.data.daycount_data);
      });
    } catch (error) {
      console.log("err :", error);
    }
  };

  const modifyDailycountHours = () => {
    const modifiedDailyCount = dailyCount.map((dataPoint) => {
      let weekday = "";

      switch (dataPoint.weekday) {
        case 0:
          weekday = "Mon";
          break;
        case 1:
          weekday = "Tues";
          break;
        case 2:
          weekday = "Wed";
          break;
        case 3:
          weekday = "Thurs";
          break;
        case 4:
          weekday = "Fri";
          break;
        case 5:
          weekday = "Sat";
          break;
        case 6:
          weekday = "Sun";
          break;
        default:
          break;
      }

      return {
        ...dataPoint,
        weekday: weekday,
      };
    });
    setDailyCountPoints(modifiedDailyCount);
  };

  // Stats for today

  useEffect(() => {
    getTodayData();
  }, []);

  useEffect(() => {
    if (todayHrCount) {
      modifyTodayHrCount();
    }
  }, [todayHrCount]);

  const getTodayData = async () => {
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
  };

  const modifyTodayHrCount = () => {
    const modifiedHourlyCount = todayHrCount.map((dataPoint) => ({
      ...dataPoint,
      hour: dataPoint.hour + 1,
    }));
    setTodayHrCountPoints(modifiedHourlyCount);
  };

  const handleMarkerClicked = () => {};

  return (
    <>
      <Container>
        {isLoaded ? (
          <>
            {heatmapDataPoints && heatmapDataPoints.length > 0 ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={initialZoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                <HeatmapLayerF data={heatmapDataPoints} />
                {topFiveLocations && topFiveLocations.length > 0 ? (
                  topFiveLocations.map((currentLocation, index) => (
                    <>
                      <MarkerF
                        key={index}
                        position={currentLocation.location}
                        icon={{
                          scale: 3,
                          path: window.google.maps.SymbolPath
                            .BACKWARD_CLOSED_ARROW,
                          strokeColor: "#0047AB",
                          strokeWeight: 2.5,
                          fillOpacity: 10,
                          fillColor: "#89CFF0",
                        }}
                        label={"location " + (index + 1)}
                        onClick={handleMarkerClicked()}
                      />
                    </>
                  ))
                ) : (
                  <div>Loading top 5 locations data...</div>
                )}
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
        {hourlyCountPoints && hourlyCountPoints.length > 0 ? (
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" interval={1} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div>Loading hourly chart data...</div>
        )}
      </Container>
      <Container>
        {hourlyCountPoints && hourlyCountPoints.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              width={500}
              height={300}
              data={dailyCountPoints}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekday" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div>Loading day chart data...</div>
        )}
      </Container>
      <Container>
        {todayHrCountPoints && todayHrCountPoints.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={500}
              height={300}
              data={todayHrCountPoints}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" interval={1} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div>Loading today chart data...</div>
        )}
      </Container>
    </>
  );
}
