import React, { useState } from "react";

const Login = ({ handleLogin }) => {  // This component will render the login form

  const [handle, setHandle] = useState(""); // This state will contain the handle
  const [rateofProblems, setRate] = useState(""); // This state will contain the rate of the problems
  const [error, setError] = useState(""); // This state will contain the error message

  const handleSubmit = (e) => { // This function will handle the form submission
    e.preventDefault();   // Prevent the default form submission

    if (handle.trim() === "") { // If the handle is empty, set the error state
      setError("Please enter a Codeforces handle.");
      return;
    }

    if (isNaN(rateofProblems) || rateofProblems < 800 || rateofProblems > 3500) { // If the rate is invalid, set the error state
      setError("Please enter a valid rate between 800 and 3500.");
      return;
    }

    const user = {  // This object will contain the user details
      handle: handle,
      rate: rateofProblems,
      problemsCount: 5,
      loggedIn: true,
    };
    localStorage.setItem("user", JSON.stringify(user)); // Store the user in localStorage

    checkHandleValidity();  // Call the checkHandleValidity function
  };

  const checkHandleValidity = async () => { // This function will check the validity of the handle
    try {  // Try to fetch the user details from the Codeforces API
      const response = await fetch(
        `https://codeforces.com/api/user.info?handles=${handle}` 
      );
      const data = await response.json(); // Parse the response to JSON

      if (data.status === "OK") { 
        // Handle is valid, call the handleLogin function
        handleLogin();
      } else {
        setError(`Invalid handle: ${handle}`);
      }
    } catch (error) { // Catch any errors
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
            onChange={(e) => setHandle(e.target.value)}
          />
        </label>
        <label>
          Rate of Problems:
          <input
            type="text"
            name="rateOfProblems"
            value={rateofProblems}
            onChange={(e) => setRate(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Login;
