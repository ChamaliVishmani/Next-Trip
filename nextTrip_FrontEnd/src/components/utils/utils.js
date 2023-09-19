export function fetchCurrentLocation(setCurrentLan, setCurrentLon) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLan(latitude);
        setCurrentLon(longitude);
      },
      (error) => {
        console.log("Error getting current location.", error);
        alert("Error getting current location.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

export async function openJourney(
  destinationLan,
  destinationLon,
  currentLan,
  currentLon
) {
  const baseUrl = "https://www.google.com/maps/dir/";
  console.log(
    "currentLan ",
    currentLan,
    " currentLon ",
    currentLon,
    " destinationLan ",
    destinationLan,
    " destinationLon",
    destinationLon
  );
  const coordsString = `${currentLan},${currentLon}/${destinationLan},${destinationLon}/`;
  const mapsUrl = baseUrl + coordsString;
  window.open(mapsUrl, "_blank");
}
