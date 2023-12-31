import React, { useState, useEffect, useCallback } from 'react';
import './../styles/Settings.css';

const Settings = () => {
  const [user, setUser] = useState({
    handle: '',
    rate: '',
    problemsCount: ''
  });

  useEffect(() => {
    // Retrieve user data from localStorage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const checkHandleValidity = useCallback(async () => {
    try {
      // Check handle validity by making an API call to Codeforces
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${user.handle}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'OK') {
          return [];
        } else {
          // Handle is not valid, return an error message
          return ['Invalid handle.'];
        }
      } else {
        // Error occurred while checking the handle validity, return an error message
        return ['An error occurred while checking the handle validity.'];
      }
    } catch (error) {
      // Error occurred while checking the handle validity, return an error message
      return ['An error occurred while checking the handle validity.'];
    }
  }, [user.handle]);

  const checkRateValidity = useCallback(() => {
    // Check if rate is a valid number within the specified range
    if (isNaN(user.rate) || user.rate < 800 || user.rate > 3500) {
      return true;
    }
    return false;
  }, [user.rate]);

  const checkProblemsCountValidity = useCallback(() => {
    // Check if problemsCount is a valid number within the specified range
    if (isNaN(user.problemsCount) || user.problemsCount < 1 || user.problemsCount > 10) {
      return true;
    }
    return false;
  }, [user.problemsCount]);

  const handleUpdate = async () => {
    let handleNotValid = false,
      rateNotValid = false,
      problemsCountNotValid = false;

    // Check if handle is empty
    if (user.handle.trim() === '') {
      handleNotValid = true;
    }

    // Check if rate is empty or invalid
    if (user.rate.trim() === '' || checkRateValidity()) {
      rateNotValid = true;
    }

    // Check if problemsCount is empty or invalid
    if (user.problemsCount.trim() === '' || checkProblemsCountValidity()) {
      problemsCountNotValid = true;
    }

    const handleValidityErrors = await checkHandleValidity();

    // Check if handle is not valid
    if (handleValidityErrors.length > 0) {
      handleNotValid = true;
    }

    // Get references to DOM elements for displaying validation messages
    let handleDocLabel = document.querySelector('.handle-label'),
      rateDocLabel = document.querySelector('.rate-label'),
      problemsDocLabel = document.querySelector('.problems-label'),
      handleDocInput = document.querySelector('.handle-input'),
      rateDocInput = document.querySelector('.rate-input'),
      problemsDocInput = document.querySelector('.problems-input');

    // Display appropriate validation messages and update styles
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
      rateDocLabel.innerHTML = 'Invalid Rate';
      rateDocInput.style.border = '1px solid red';
    } else {
      rateDocLabel.style.color = 'green';
      rateDocLabel.innerHTML = 'Rate of Problems';
      rateDocInput.style.border = '1px solid green';
    }

    if (problemsCountNotValid) {
      problemsDocLabel.style.color = 'red';
      problemsDocLabel.innerHTML = 'Invalid Number of Problems';
      problemsDocInput.style.border = '1px solid red';
    } else {
      problemsDocLabel.style.color = 'green';
      problemsDocLabel.innerHTML = 'Number of Problems';
      problemsDocInput.style.border = '1px solid green';
    }

    // If any validation error exists, stop the update process
    if (handleNotValid || rateNotValid || problemsCountNotValid) {
      return;
    }

    const newUser = { ...user, loggedIn: true };

    // Update user data in localStorage
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);

    // Refresh the page
    window.location.reload();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    // Remove user data from localStorage and refresh the page
    localStorage.removeItem('user');
    localStorage.removeItem('generatedProblems');
    window.location.reload();
  };

  const renderForm = () => (
    <form className="settings__form">
      <label className="handle-label">Codeforces Handle</label>
      <input type="text" name="handle" value={user.handle} onChange={handleInputChange} className="handle-input" />
      <label className="rate-label">Rate of Problems</label>
      <input type="text" name="rate" value={user.rate} onChange={handleInputChange} className="rate-input" />
      <label className="problems-label">Number of Problems</label>
      <input
        type="text"
        name="problemsCount"
        className="problems-input"
        value={user.problemsCount}
        onChange={handleInputChange}
      />
    </form>
  );

  const renderSettings = () => (
    <div className="settings">
      {renderForm()}
      <div className="settings__btns">
        <button className="logout__btn" onClick={handleLogout}>
          Logout
        </button>
        <button className="update__btn" onClick={handleUpdate}>
          Update
        </button>
      </div>
    </div>
  );

  return (
    <div className="container">
      {renderSettings()}
    </div>
  );
};

export default Settings;
