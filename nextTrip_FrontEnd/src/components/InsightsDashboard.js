import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  GoogleMap,
  useJsApiLoader,
  HeatmapLayerF,
  MarkerF,
  InfoWindowF,
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
  Label,
} from "recharts";

import { googleMapsApiKey } from "../keys.js";
import { Container } from "semantic-ui-react";
import {
  predictDestination,
  fetchAddress,
  setHeatMapDataPointsFunc,
  getHeatMapData,
  getTodayData,
  getDayCountData,
} from "./utils/locationApi.js";
import { openJourney, fetchCurrentLocation } from "./utils/utils.js";
import { Link } from "react-router-dom";

const mapContainerStyle = {
  width: "100%",
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

  const [currentLan, setCurrentLan] = useState(0);
  const [currentLon, setCurrentLon] = useState(0);
  const [showPredictedAddressInfo, setShowPredictedAddressInfo] =
    useState(false);
  const [showAddressInfo, setShowAddressInfo] = useState(false);
  const [clickedMarkerIndex, setClickedMarkerIndex] = useState(null);

  const [predictedLan, setPredictedLan] = useState();
  const [predictedLon, setPredictedLon] = useState();
  const [address, setAddress] = useState("");

  // HeatMap
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

  useEffect(() => {
    // Initial data fetch
    getHeatMapData(
      setHeatMapData,
      heatmapData,
      setHeatMapDataPoints,
      setTopFiveLocations
    );

    // Fetch data every hour
    const intervalId = setInterval(
      getHeatMapData(
        setHeatMapData,
        heatmapData,
        setHeatMapDataPoints,
        setTopFiveLocations
      ),
      3600000
    );

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (heatmapData) {
      setHeatMapDataPointsFunc(
        heatmapData,
        setHeatMapDataPoints,
        setTopFiveLocations
      );
    }
  }, [heatmapData]);

  // predicted location marker

  useEffect(() => {
    // Initial data fetch
    predictDestination(
      predictedLan,
      predictedLon,
      setPredictedLan,
      setPredictedLon,
      setAddress
    );

    // Fetch data every hour
    const intervalId = setInterval(predictDestination, 3600000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  //Stats by Hour

  useEffect(() => {
    if (hourlyCount) {
      modifyHourlycountHours();
    }
  }, [hourlyCount]);

  useEffect(() => {
    getHourCountData();
    getDayCountData(setDailyCount);
    getTodayData(setTodayHrCount);
    fetchCurrentLocation(setCurrentLan, setCurrentLon);
  }, []);

  useEffect(() => {
    if (dailyCount) {
      modifyDailycountHours();
    }
  }, [dailyCount]);

  useEffect(() => {
    if (todayHrCount) {
      modifyTodayHrCount();
    }
  }, [todayHrCount]);

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

  const modifyTodayHrCount = () => {
    const modifiedHourlyCount = todayHrCount.map((dataPoint) => ({
      ...dataPoint,
      hour: dataPoint.hour + 1,
    }));
    setTodayHrCountPoints(modifiedHourlyCount);
  };

  const openMapJourney = async (destinationLan, destinationLon) => {
    openJourney(destinationLan, destinationLon, currentLan, currentLon);
    console.log("currentLan ", currentLan, " currentLon ", currentLon);
  };

  const showPredictedAddress = (lat, lon) => {
    fetchAddress(lat, lon, setAddress);
    setShowPredictedAddressInfo(true);
  };

  const showLocationAddress = (index, lat, lon) => {
    setClickedMarkerIndex(index);
    setShowPredictedAddressInfo(false);
    fetchAddress(lat, lon, setAddress);
    setShowAddressInfo(true);
  };

  const tabs = {
    heatMap: "heatMap",
    todayInsights: "todayInsights",
    dataInsights: "dataInsights",
    driverMain: "driverMain",
  };

  const [selectedTab, setSelectedTab] = useState("heatMap");

  const selectTabHandle = (tab) => {
    const tabElements = document.querySelectorAll("button");
    tabElements.forEach((tabElement) => {
      tabElement.classList.remove("border-b-2", "border-blue-500");
      tabElement.style.color = "gray";
    });

    const selectedTabElement = document.getElementById(`${tab}Tab`);
    selectedTabElement.classList.add("border-b-2", "border-blue-500");
    selectedTabElement.style.color = "blue";

    setSelectedTab(tab);
  };

  return (
    <>
      <div className="rounded-lg h-screen bg-blue-500 m-4">
        <div className="bg-white rounded-lg">
          <nav class="flex justify-between items-center">
            <button
              id="heatMapTab"
              class="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none text-blue-500 border-b-2 font-medium border-blue-500"
              onClick={() => selectTabHandle(tabs.heatMap)}
            >
              Heat Map / Locations
            </button>
            <button
              id="todayInsightsTab"
              class="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none"
              onClick={() => selectTabHandle(tabs.todayInsights)}
            >
              Today's Insights
            </button>
            <button
              id="dataInsightsTab"
              class="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none"
              onClick={() => selectTabHandle(tabs.dataInsights)}
            >
              Data Insights
            </button>
            <Link to="/predict_location">
              <button
                id="driverMainTab"
                class="text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none"
                onClick={() => selectTabHandle(tabs.driverMain)}
              >
                Home
              </button>
            </Link>
          </nav>
        </div>
        {selectedTab == tabs.heatMap && (
          <div className="flex items-center justify-center bg-blue-400 text-white p-4 rounded-lg shadow-md m-2">
            {isLoaded ? (
              <>
                {heatmapDataPoints && heatmapDataPoints.length > 0 ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
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
                            onDblClick={() =>
                              openMapJourney(
                                currentLocation.location.lat(),
                                currentLocation.location.lng()
                              )
                            }
                            onClick={() =>
                              showLocationAddress(
                                index,
                                currentLocation.location.lat(),
                                currentLocation.location.lng()
                              )
                            }
                          >
                            {showAddressInfo && clickedMarkerIndex == index && (
                              <InfoWindowF position={currentLocation.location}>
                                <div className="info-window-content">
                                  <h4>{address}</h4>
                                </div>
                              </InfoWindowF>
                            )}
                          </MarkerF>
                        </>
                      ))
                    ) : (
                      <div>Loading top 5 locations data...</div>
                    )}
                    {predictedLan && predictedLon ? (
                      <MarkerF
                        position={
                          new window.google.maps.LatLng(
                            predictedLan,
                            predictedLon
                          )
                        }
                        icon={{
                          scale: 3,
                          path: window.google.maps.SymbolPath
                            .BACKWARD_CLOSED_ARROW,
                          strokeColor: "#0047AB",
                          strokeWeight: 2.5,
                          fillOpacity: 10,
                          fillColor: "#0047AB",
                        }}
                        label={"Predicted Location"}
                        onDblClick={() =>
                          openMapJourney(predictedLan, predictedLon)
                        }
                        onClick={() =>
                          showPredictedAddress(predictedLan, predictedLon)
                        }
                      >
                        {showPredictedAddressInfo && (
                          <InfoWindowF
                            position={
                              new window.google.maps.LatLng(
                                predictedLan,
                                predictedLon
                              )
                            }
                          >
                            <div className="info-window-content">
                              <h4>{address}</h4>
                            </div>
                          </InfoWindowF>
                        )}
                      </MarkerF>
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
          </div>
        )}
        {selectedTab == tabs.dataInsights && (
          <>
            <div className="flex items-center justify-center bg-blue-400 text-white p-4 rounded-lg shadow-md m-2">
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
                    style={{ background: "#fff" }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" interval={1}>
                      <Label
                        value="Hour (24 hr format)"
                        offset={-2}
                        position="insideBottom"
                      />
                    </XAxis>
                    <YAxis
                      label={{
                        value: "Number of rides",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      name="Rides frequency by hour"
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div>Loading hourly chart data...</div>
              )}
            </div>
            <div className="flex items-center justify-center bg-blue-400 text-white p-4 rounded-lg shadow-md m-2">
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
                    style={{ background: "#fff" }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="weekday">
                      <Label
                        value="Day of the week"
                        offset={-2}
                        position="insideBottom"
                      />
                    </XAxis>
                    <YAxis
                      label={{
                        value: "Number of rides",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Bar
                      name="Ride frequency by weekday"
                      dataKey="count"
                      fill="#8884d8"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div>Loading day chart data...</div>
              )}
            </div>
          </>
        )}
        {selectedTab == tabs.todayInsights && (
          <div className="flex items-center justify-center bg-blue-400 text-white p-4 rounded-lg shadow-md m-2">
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
                  style={{ background: "#fff" }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" interval={1}>
                    <Label
                      value="Hour (24 hr format)"
                      offset={-2}
                      position="insideBottom"
                    />
                  </XAxis>
                  <YAxis
                    label={{
                      value: "Number of rides",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    name="Rides frequency by hour for Today"
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div>Loading today chart data...</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
