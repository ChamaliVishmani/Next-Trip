import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";

import "./login.css";
import { loginUser } from "../utils/loginApi.js";

export default function Login({ setUserLoggedIn, setRole, setAccessToken }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const { enqueueSnackbar } = useSnackbar();

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
    </div>
  );
}

Login.propTypes = {
  setUserLoggedIn: PropTypes.func.isRequired,
  setRole: PropTypes.func.isRequired,
  setAccessToken: PropTypes.func.isRequired,
};
