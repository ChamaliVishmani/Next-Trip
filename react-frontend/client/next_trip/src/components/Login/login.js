import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";

import "./login.css";
import { loginUser } from "../../components/utils/loginApi.js";
import { getUserContent } from "../utils/userContent.js";
import SignUp from "../SignUp/signUp";
import { useNavigate } from "react-router-dom";

export default function Login({ setUserLoggedIn, setUserType }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState();
  const [accessToken, setAccessToken] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signUp");
  };

  // const loginUser = async (credentials) => {
  //   try {
  //     const apiUrl = `http://localhost:8080/api/auth/signin`;

  //     const response = await axios.post(apiUrl, JSON.stringify(credentials), {
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     enqueueSnackbar(response.data.message, { variant: "success" });
  //     setUserLoggedIn(true);
  //   } catch (error) {
  //     enqueueSnackbar(
  //       error.response.data.message || "An error occurred while login user",
  //       {
  //         variant: "error",
  //       }
  //     );
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(
        {
          userName,
          password,
        },
        setUserLoggedIn,
        setRole,
        setAccessToken,
        enqueueSnackbar
      );
      console.log("handleSubmit ", accessToken);
      const userType = await getUserContent(accessToken);

      setUserType(userType);
      switch (userType) {
        case "Driver":
          navigate("/predict_location");
      }
    } catch (error) {
      console.log("error :", error);
    }
  };

  return (
    <div className="login-wrapper">
      <h1>Login for your Next-Trip</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={(e) => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      <div>
        <button type="button" onClick={handleSignUp}>
          Register
        </button>
      </div>
    </div>
  );
}

Login.propTypes = {
  setUserLoggedIn: PropTypes.func.isRequired,
};
