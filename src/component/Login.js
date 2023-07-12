import React, { useState, useCallback } from "react";
import "./../styles/Login.css";
import circle from "./../images/circle.webp";
import cupe from "./../images/cupe.webp";

const Login = ({ handleLogin }) => {
  const [handle, setHandle] = useState(""); // State for the handle input
  const [rateofProblems, setRate] = useState(""); // State for the rate of problems input
  const [problemsCount, setProblemsCount] = useState(""); // State for the number of problems input

  const checkHandleValidity = useCallback(async () => {
    try {
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'OK') {
          return [];
        } else {
          // Handle is not valid, return an error message
        }
      } else {
        return ['An error occurred while checking the handle validity.'];
      }
    } catch (error) {
      return ['An error occurred while checking the handle validity.'];
    }
  }, [handle]);

  const checkRateValidity = useCallback(() => {
    if (isNaN(rateofProblems) || rateofProblems < 800 || rateofProblems > 3500) {
      return true;
    }
    return false;
  }, [rateofProblems]);

  const checkProblemsCountValidity = useCallback(() => {
    if (isNaN(problemsCount) || problemsCount < 1 || problemsCount > 10) {
      return true;
    }
    return false;
  }, [problemsCount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let handleNotValid = false,
      rateNotValid = false,
      problemsCountNotValid = false;

    if (handle.trim() === "") {
      handleNotValid = true;
    }

    if (rateofProblems.trim() === "" || checkRateValidity()) {
      rateNotValid = true;
    }

    if (problemsCount.trim() === "" || checkProblemsCountValidity()) {
      problemsCountNotValid = true;
    }

    const handleValidityErrors = await checkHandleValidity();
    if (handleValidityErrors.length > 0) {
      handleNotValid = true;
    }

    let handleDocLabel = document.querySelector('.handle__label'),
      rateDocLabel = document.querySelector('.rate__label'),
      problemsDocLabel = document.querySelector('.problems__label'),
      handleDocInput = document.querySelector('.handle__input'),
      rateDocInput = document.querySelector('.rate__input'),
      problemsDocInput = document.querySelector('.problems__input');

    if (handleNotValid) {
      handleDocLabel.style.color = 'red';
      handleDocLabel.innerHTML = 'Invalid Handle';
      handleDocInput.style.border = '1px solid red';
    } else {
      handleDocLabel.style.color = 'green';
      handleDocLabel.innerHTML = 'Codeforces Handle';
      handleDocInput.style.border = '1px solid green';
    }

    if (rateNotValid) {
      rateDocLabel.style.color = 'red';
      rateDocLabel.innerHTML = 'Invalid Rating';
      rateDocInput.style.border = '1px solid red';
    } else {
      rateDocLabel.style.color = 'green';
      rateDocLabel.innerHTML = 'Rating';
      rateDocInput.style.border = '1px solid green';
    }

    if (problemsCountNotValid) {
      problemsDocLabel.style.color = 'red';
      problemsDocLabel.innerHTML = 'Invalid Problems Count';
      problemsDocInput.style.border = '1px solid red';
    } else {
      problemsDocLabel.style.color = 'green';
      problemsDocLabel.innerHTML = 'Problems Count';
      problemsDocInput.style.border = '1px solid green';
    }

    if (handleNotValid || rateNotValid || problemsCountNotValid) {
      return;
    }

    const user = {
      handle: handle,
      rate: rateofProblems,
      problemsCount: problemsCount,
      loggedIn: true,
    };

    localStorage.setItem("user", JSON.stringify(user));
    handleLogin();
  };

  return (
    <div className="container">
      <div className="login">
        <div className="shape shape-1">
          <img src={circle} alt="circle" />
        </div>
        <div className="shape shape-2">
          <img src={cupe} alt="cupe" />
        </div>
        <form onSubmit={handleSubmit} className="login__form">
          <h1 className="login__title">Login</h1>
          <label className="login__label handle__label">Enter your Handle</label>
          <input
            type="text"
            name="handle"
            placeholder="Handle"
            className="login__input handle__input"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />
          <label className="login__label rate__label">Enter your Rating</label>
          <input
            type="text"
            name="rateOfProblems"
            placeholder="800-3500"
            className="login__input rate__input"
            value={rateofProblems}
            onChange={(e) => setRate(e.target.value)}
          />
          <label className="login__label problems__label">Enter the number of problems</label>
          <input
            type="text"
            name="problemsCount"
            placeholder="1-10"
            className="login__input problems__input"
            onChange={(e) => setProblemsCount(e.target.value)}
          />
          <button type="submit" className="login__btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
