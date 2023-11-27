import axios from "axios";

export async function updateRidesDB(pickupLan, pickupLon) {
  const now = new Date();

  const formattedDate = `${
    now.getMonth() + 1
  }/${now.getDate()}/${now.getFullYear()}`;
  const formattedTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  const dateTime = `${formattedDate} ${formattedTime}`;

  const lat = pickupLan;
  const lon = pickupLon;

  const requestBody = { dateTime, lat, lon };

  try {
    const apiUrl = `http://localhost:8080/api/rides/add`;
    await axios.post(apiUrl, JSON.stringify(requestBody), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("error while updating rides_data database :", error);
  }
}

export async function requestRide(pickupLan, pickupLon) {
  const now = new Date();

  const formattedDate = `${
    now.getMonth() + 1
  }/${now.getDate()}/${now.getFullYear()}`;
  const formattedTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  const dateTime = `${formattedDate} ${formattedTime}`;

  const lat = pickupLan;
  const lon = pickupLon;

  const requestBody = { dateTime, lat, lon };

  try {
    const apiUrl = `http://localhost:5000/ride/request`;
    await axios.post(apiUrl, JSON.stringify(requestBody), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("error while requesting ride :", error);
  }
}
