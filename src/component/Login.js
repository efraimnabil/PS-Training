import React, { useState } from "react";

const Login = ({ handleLogin }) => {
  const [handle, setHandle] = useState("");
  const [rate, setRate] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    if (event.target.name === "handle") {
      setHandle(event.target.value);
    } else if (event.target.name === "rate") {
      setRate(event.target.value);
    }
    const user = {
      handle: handle,
      rate: rate,
      loggedIn: true,
    };
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (handle.trim() === "") {
      setError("Please enter a Codeforces handle.");
      return;
    }

    if (isNaN(rate) || rate < 800 || rate > 3500) {
      setError("Please enter a valid rate between 800 and 3500.");
      return;
    }

    checkHandleValidity();
  };

  const checkHandleValidity = async () => {
    try {
      const response = await fetch(
        `https://codeforces.com/api/user.info?handles=${handle}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        // Handle is valid, call the handleLogin function
        handleLogin();
      } else {
        setError(`Invalid handle: ${handle}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred while checking the handle validity.");
    }
  };

  return (
    <div className="login">
      <h1>Welcome</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Codeforces Handle:
          <input
            type="text"
            name="handle"
            value={handle}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Rate:
          <input
            type="text"
            name="rate"
            value={rate}
            onChange={handleInputChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Login;
