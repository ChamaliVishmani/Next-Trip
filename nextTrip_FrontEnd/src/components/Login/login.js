import React, { useState } from "react";
import { useSnackbar } from "notistack";

import "./login.css";
import { loginUser } from "../../components/utils/loginApi.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
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

      sessionStorage.setItem("userName", userName);
    } catch (error) {
      console.log("error :", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-400 text-white p-4 rounded-lg shadow-md overflow-auto">
      <div className="h-max mx-auto flex flex-col items-center">
        <img
          className="h-[150px] w-[150px] mb-5"
          src="https://png.pngtree.com/png-clipart/20191120/original/pngtree-boy-taxi-tuk-tuk-png-image_5044265.jpg?resize=400x0?color=indigo&shade=600"
          alt=""
        />
        <h1 className="text-3xl font-bold text-center pb-6">
          Sign in to your account
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
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-8">
              <input
                className="bg-[#4F46E5] w-full py-3 rounded-md text-white font-bold cursor-pointer hover:bg-[#181196] text-lg"
                type="submit"
                value="Login"
              />
            </div>
          </form>
          <div>
            <p className="text-center text-black font-bold">Or continue with</p>
          </div>
          <div className="flex justify-center items-center">
            <button
              className="bg-[#1D9BF0] w-1/2 py-2 rounded-md text-white font-bold cursor-pointer hover:bg-[#181196] text-lg"
              onClick={handleSignUp}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {};
