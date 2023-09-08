import axios from "axios";

function setElement(array, component, setComponent, enqueueSnackbar) {
  const componentIndex = array.findIndex((element) =>
    element.includes(component)
  );
  if (componentIndex !== -1 && componentIndex < array.length - 2) {
    const elementContent = array[componentIndex + 2].trim();
    setComponent(elementContent);
  } else {
    enqueueSnackbar("No " + component + " found for user", {
      variant: "warning",
    });
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

    enqueueSnackbar("Logged in successfully", { variant: "success" });

    const responseComponents = JSON.stringify(response).split('"');

    setElement(responseComponents, "roles", setRole, enqueueSnackbar);
    setElement(
      responseComponents,
      "accessToken",
      setAccessToken,
      enqueueSnackbar
    );

    setUserLoggedIn(true);
  } catch (error) {
    enqueueSnackbar(
      error.response?.data?.message || "An error occurred while login user",
      {
        variant: "error",
      }
    );
  }
}
