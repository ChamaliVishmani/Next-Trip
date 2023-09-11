import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Dropdown } from "semantic-ui-react";
import validator from "validator";

import "./signUp.css";
import { loginUser } from "../utils/loginApi";

export default function SignUp() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  // const [userSignedUp, setUserSignedUp] = useState(true);

  const { enqueueSnackbar } = useSnackbar();

  const validatePWStrength = (value) => {
    if (
      validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setPasswordStrength("Strong Password");
    } else {
      setPasswordStrength("Weak Password");
    }
  };

  const disabledRegister =
    passwordStrength !== "Strong Password" ||
    userName === "" ||
    password === "" ||
    email === "" ||
    roles.length === 0;

  const registerUser = async (credentials) => {
    try {
      const apiUrl = `http://localhost:8080/api/auth/signup`;

      const response = await axios.post(apiUrl, JSON.stringify(credentials), {
        headers: { "Content-Type": "application/json" },
      });

      enqueueSnackbar(response.data.message, { variant: "success" });

      await loginUser(
        {
          userName,
          password,
        },
        setRoles,
        setAccessToken,
        enqueueSnackbar
      );
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
      roles,
    });
  };

  const handleUserTypeChange = (event) => {
    const userType = event.target.innerText;

    switch (userType) {
      case "Driver":
        setRoles(["user"]);
        // setUserSignedUp("Driver");
        break;
      case "Rider":
        setRoles(["moderator"]);
        // setUserSignedUp("Rider");
        break;
      default:
        setRoles(["user"]);
      // setUserSignedUp("Driver");
    }

    console.log("role : ", roles);
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
            onChange={(e) => {
              setPassword(e.target.value);
              validatePWStrength(e.target.value);
            }}
          />
        </label>
        <span>{passwordStrength}</span>
        <label>
          <p>Email</p>
          <input type="email" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <div>
          <Dropdown
            labeled
            options={[
              { key: "Driver", text: "Driver", value: "user" },
              { key: "Rider", text: "Rider", value: "moderator" },
            ]}
            selection
            onChange={handleUserTypeChange}
            placeholder="Driver / Rider"
          />
        </div>
        <div>
          <button type="submit" disabled={disabledRegister}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

SignUp.propTypes = {};
