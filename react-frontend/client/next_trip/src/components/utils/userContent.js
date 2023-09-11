import axios from "axios";

function setUserLoggedInRole(role) {
  // sessionStorage.setItem("userLoggedIn", userLoggedIn);
  sessionStorage.setItem("role", role);
}

export async function authenticateDriver(accessToken, role) {
  try {
    let apiUrl = ``;
    console.log("authenticateDriver role : ", role);
    switch (role) {
      case "ROLE_USER":
        apiUrl = `http://localhost:8080/api/driverBoard`;
        setUserLoggedInRole("Driver");
        break;
      case "ROLE_MODERATOR":
        apiUrl = `http://localhost:8080/api/riderBoard`;
        setUserLoggedInRole("Rider");
        break;
      default:
        break;
    }
    const response = await axios.get(apiUrl, {
      headers: { "x-access-token": accessToken },
    });
    const responseJson = JSON.stringify(response).split('"');
    const redirectUrlIndex = responseJson.findIndex((element) =>
      element.includes("redirectUrl")
    );
    const redirectUrl = responseJson[redirectUrlIndex + 2];
    console.log("responseJson", response);
    console.log("redirectUrl", response.data);

    window.location.href = redirectUrl;
  } catch (error) {
    console.error("Request error:", error);
  }
}
