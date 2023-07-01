import React, { useState, useEffect, useCallback } from 'react';
import './../styles/Settings.css';

const Settings = () => {
  const [user, setUser] = useState({
    handle: '',
    rate: '',
    problemsCount: ''
  });
  const [error, setError] = useState("");
  const [isButtonActive, setIsButtonActive] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const checkHandleValidity = useCallback(async () => {
    try {
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${user.handle}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === "OK") {
          setError("");
          setIsButtonActive(true);
          return true;
        } else {
          setError(`Invalid handle: ${user.handle}`);
          setIsButtonActive(false);
          return false;
        }
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
      setIsButtonActive(false);
      return false;
    }
  }, [user.handle]);
  

  const checkRateValidity = useCallback(() => {
    if (user.rate < 800 || user.rate > 3500) {
      setError("Please enter a valid rate between 800 and 3500.");
      return false;
    }
    return true;
  }, [user.rate]);

  const checkProblemsCountValidity = useCallback(() => {
    if (user.problemsCount < 1 || user.problemsCount > 10) {
      setError("Please enter a valid number of problems between 1 and 10.");
      return false;
    }
    return true;
  }, [user.problemsCount]);

  const handleUpdate = async () => {
    if (checkHandleValidity() && checkRateValidity() && checkProblemsCountValidity()) {
      const newUser = {
        ...user,
        loggedIn: true,
      };
      localStorage.setItem("user", JSON.stringify(newUser));
      window.location.reload();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  useEffect(() => {
    if (checkHandleValidity() && checkRateValidity() && checkProblemsCountValidity()) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  }, [user, checkHandleValidity, checkProblemsCountValidity, checkRateValidity]);

  const renderForm = () => {
    return (
      <form className="settings__form">
        <label>
          Codeforces Handle:
          <input
            type="text"
            name="handle"
            value={user.handle}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Rate of Problems:
          <input
            type="text"
            name="rate"
            value={user.rate}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Number of Problems:
          <input
            type="text"
            name="problemsCount"
            value={user.problemsCount}
            onChange={handleInputChange}
          />
        </label>
      </form>
    );
  };

  const renderSettings = () => {
    return (
      <div className="settings">
        {renderForm()}
        {error && <p className="error">{error}</p>}
        <button className="update-btn" onClick={handleUpdate} disabled={!isButtonActive}>
          Update
        </button>
      </div>
    );
  };

  return (
    <div className="settings">
      <div>Settings</div>
      {renderSettings()}
    </div>
  );
};

export default Settings;
