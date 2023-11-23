import React, { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Dropdown } from "semantic-ui-react";
import validator from "validator";

import "./signUp.css";
import { loginUser } from "../utils/loginApi";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

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
        break;
      case "Rider":
        setRoles(["moderator"]);
        break;
      default:
        setRoles(["user"]);
    }

    console.log("role : ", roles);
  };

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-400 text-white p-4 rounded-lg shadow-md overflow-auto min-h-screen">
      <div className="h-max mx-auto flex flex-col items-center pt-20">
        <img
          className="h-[150px] w-[150px] mb-0"
          src="https://png.pngtree.com/png-clipart/20191120/original/pngtree-boy-taxi-tuk-tuk-png-image_5044265.jpg?resize=400x0?color=indigo&shade=600"
          alt=""
        />
        <h1 className="text-3xl font-bold text-center pb-6">
          Register for Next Trip
        </h1>

        <div className="bg-white shadow-xl p-8 flex flex-col gap-6 text-lg rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div>
              <label className="text-gray-600 font-bold inline-block pb-2">
                User Name
              </label>
              <input
                className="border border-gray-400 focus:outline-slate-400 rounded-md w-full shadow-sm px-6 py-3 text-black text-lg"
                type="text"
                name="userName"
                placeholder="userName"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-gray-600 font-bold inline-block pb-2 mt-2">
                Password
              </label>
              <input
                className="border border-gray-400 focus:outline-slate-400 rounded-md w-full shadow-sm px-6 py-3 text-black text-lg"
                type="password"
                name="password"
                placeholder="******"
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePWStrength(e.target.value);
                }}
              />
              <span className="focus:outline-slate-400 rounded-md w-full shadow-sm px-3 py-1 text-gray-500 text-sm">
                {passwordStrength}
              </span>
            </div>
            <div>
              <label className="text-gray-600 font-bold inline-block pb-2 mt-2">
                Email
              </label>
              <input
                className="border border-gray-400 focus:outline-slate-400 rounded-md w-full shadow-sm px-6 py-3 text-black text-lg"
                type="email"
                name="email"
                placeholder="user@email.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-gray-600 font-bold inline-block pb-2 mt-2">
                Driver / Rider
              </label>
              <div>
                <Dropdown
                  className="text-gray-600 font-bold inline-block pb-2 mt-2"
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
            </div>
            <div className="mt-8">
              <input
                className={
                  disabledRegister
                    ? "bg-[gray] w-full py-3 rounded-md text-white font-bold cursor-pointer hover:bg-[#181196] text-lg"
                    : "bg-[#1D9BF0] w-full py-3 rounded-md text-white font-bold cursor-pointer hover:bg-[#181196] text-lg"
                }
                type="submit"
                value="Register"
                disabled={disabledRegister}
              />
            </div>
          </form>
          <div>
            <p className="text-center text-black font-bold">Or continue with</p>
          </div>
          <div className="flex justify-center items-center">
            <button
              className="bg-[#4F46E5] w-1/2 py-2 rounded-md text-white font-bold cursor-pointer hover:bg-[#181196] text-lg"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

SignUp.propTypes = {};
