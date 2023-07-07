import React, { useState, useEffect, useCallback } from 'react';
import './../styles/Settings.css';

const Settings = () => {
  const [user, setUser] = useState({
    handle: '',
    rate: '',
    problemsCount: ''
  });
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
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
        if (data.status === 'OK') {
          return true;
        } else {
          
        }
      } else {
        return [`Invalid handle: ${user.handle}`];
      }
    } catch (error) {
      return ['An error occurred while checking the handle validity.'];
    }
  }, [user.handle]);

  const checkRateValidity = useCallback(() => {
    const rateErrors = [];
    if (isNaN(user.rate) || user.rate < 800 || user.rate > 3500) {
      rateErrors.push('Please enter a valid rate between 800 and 3500.');
    }
    return rateErrors;
  }, [user.rate]);

  const checkProblemsCountValidity = useCallback(() => {
    const problemsCountErrors = [];
    if (isNaN(user.problemsCount) || user.problemsCount < 1 || user.problemsCount > 10) {
      problemsCountErrors.push('Please enter a valid number of problems between 1 and 10.');
    }
    return problemsCountErrors;
  }, [user.problemsCount]);

  const handleUpdate = async () => {
    const inputErrors = [
      ...checkRateValidity(),
      ...checkProblemsCountValidity(),
    ];

    if (user.handle.trim() === '') {
      inputErrors.push('Please enter a Codeforces handle.');
    }

    if (inputErrors.length > 0) {
      setErrors(inputErrors);
      return;
    }

    const handleValidityErrors = await checkHandleValidity();
    if (handleValidityErrors.length > 0) {
      setErrors(handleValidityErrors);
      return;
    }

    const newUser = { ...user, loggedIn: true };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
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
    localStorage.removeItem('user');
    localStorage.removeItem('generatedProblems');
    window.location.reload();
  };

  const renderForm = () => (
    <form className="settings__form">
      <label>
        Codeforces Handle
        <input type="text" name="handle" value={user.handle} onChange={handleInputChange} />
      </label>
      <label>
        Rate of Problems:
        <input type="text" name="rate" value={user.rate} onChange={handleInputChange} />
      </label>
      <label>
        Number of Problems
        <input
          type="text"
          name="problemsCount"
          value={user.problemsCount}
          onChange={handleInputChange}
        />
      </label>
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
      {errors.length > 0 && (
        <div className="errors">
          {errors.map((error, index) => (
            <p key={index} className="error">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="containerr">
      {renderSettings()}
    </div>
  );
};

export default Settings;
