import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";

import "./login.css";
import { loginUser } from "../../components/utils/loginApi.js";
import { useNavigate } from "react-router-dom";

export default function Login({ setUserType }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState();
  const [accessToken, setAccessToken] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signUp");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(
        {
          userName,
          password,
        },
        setRole,
        setAccessToken,
        enqueueSnackbar
      );
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

Login.propTypes = {};
