import axios from "axios";

export async function authenticateDriver(accessToken) {
  try {
    console.log("accessToken1 ", accessToken);
    const apiUrl = `http://localhost:8080/api/driver`;
    console.log("accessToken ", accessToken);

    const response = await axios.get(apiUrl, {
      headers: { "x-access-token": accessToken },
    });
    console.log("Response:", response);
    // enqueueSnackbar("Logged in successfully", { variant: "success" });

    // const responseComponents = JSON.stringify(response).split('"');

    // setElement(responseComponents, "roles", setRole, enqueueSnackbar);
    // setElement(
    //   responseComponents,
    //   "accessToken",
    //   setAccessToken,
    //   enqueueSnackbar
    // );

    // setUserLoggedIn(true);
    return response.data;
  } catch (error) {
    console.error("Request error:", error);
    // enqueueSnackbar(
    //   error.response?.data?.message || "An error occurred while login user",
    //   {
    //     variant: "error",
    //   }
    // );
    return "";
  }
}
