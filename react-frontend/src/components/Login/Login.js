import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Login.css";
// import { userSignUp } from "../../types/types";

// class user {
//   constructor(username, email, password, roles) {
//     this.username = username;
//     this.email = email;
//     this.password = password;
//     this.roles = roles;
//   }
// }

async function loginUser(credentials) {
  return await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [role, setRole] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const credentials = {
    //   username: username,
    //   email: email,
    //   password: password,
    //   roles: [role],
    // };
    const token = await loginUser({
      username,
      email,
      password,
      role,
    });
    setToken(token);
  };

  return (
    <div className="login-wrapper">
      <h1>Please Log In</h1>
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
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
