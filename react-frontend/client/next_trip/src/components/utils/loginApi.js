import axios from "axios";
import { authenticateDriver } from "./userContent.js";

async function setElement(array, component, enqueueSnackbar) {
  const componentIndex = array.findIndex((element) =>
    element.includes(component)
  );
  if (componentIndex !== -1 && componentIndex < array.length - 2) {
    const elementContent = array[componentIndex + 2].trim();
    return elementContent;
  } else {
    enqueueSnackbar("No " + component + " found for user", {
      variant: "warning",
    });
    return "";
  }
}

export async function loginUser(
  credentials,
  setUserLoggedIn,
  setRole,
  setAccessToken,
  enqueueSnackbar
) {
  try {
    const apiUrl = `http://localhost:8080/api/auth/signin`;

    const response = await axios.post(apiUrl, JSON.stringify(credentials), {
      headers: { "Content-Type": "application/json" },
    });

    const responseComponents = JSON.stringify(response).split('"');

    const rolePromise = setElement(
      responseComponents,
      "roles",
      setRole,
      enqueueSnackbar
    );

    const accessTokenPromise = setElement(
      responseComponents,
      "accessToken",
      setAccessToken,
      enqueueSnackbar
    );

    const [role, accessToken] = await Promise.all([
      rolePromise,
      accessTokenPromise,
    ]);

    setRole(role);
    setAccessToken(accessToken);

    setUserLoggedIn(true);

    enqueueSnackbar("Logged in successfully", { variant: "success" });
    // getUserContent(accessToken);
    // console.log("accessToken ", accessToken);
  } catch (error) {
    enqueueSnackbar(
      error.response?.data?.message || "An error occurred while login user",
      {
        variant: "error",
      }
    );
  }
}
