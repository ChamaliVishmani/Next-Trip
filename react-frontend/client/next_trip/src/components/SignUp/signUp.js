import React, { useState } from "react";
import PropTypes from "prop-types";
import "./signUp.css";
import axios from "axios";
import { useSnackbar } from "notistack";

export default function SignUp({ setUserSignedUp }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const registerUser = async (credentials) => {
    try {
      const apiUrl = `http://localhost:8080/api/auth/signup`;

      const response = await axios.post(apiUrl, JSON.stringify(credentials), {
        headers: { "Content-Type": "application/json" },
      });

      enqueueSnackbar(response.data.message, { variant: "success" });
      setUserSignedUp(true);
    } catch (error) {
      enqueueSnackbar(
        error.response.data.message ||
          "An error occurred while registering user",
        {
          variant: "error",
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await registerUser({
      userName,
      email,
      password,
      role,
    });
  };

  return (
    <div className="login-wrapper">
      <h1>SignUp for Next-Trip</h1>
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
        <label>
          <p>Email</p>
          <input type="email" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <p>Type : user, moderator or admin</p>
          <input type="text" onChange={(e) => setRole(e.target.value)} />
        </label>
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}

SignUp.propTypes = {
  setUserRegistered: PropTypes.func.isRequired,
};
