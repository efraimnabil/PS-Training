import React, { useState, useEffect, useCallback } from 'react';
import './../styles/Settings.css';

const Settings = () => {
  const [user, setUser] = useState({
    handle: '',
    rate: '',
    problemsCount: ''
  });
  const [error, setError] = useState('');

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
          setError('');
          return true;
        } else {
          setError(`Invalid handle: ${user.handle}`);
          return false;
        }
      } else {
        setError(`Invalid handle: ${user.handle}`);
        return false;
      }
    } catch (error) {
      setError('An error occurred while checking the handle validity.');
      return false;
    }
  }, [user.handle]);

  const checkRateValidity = useCallback(() => {
    if (user.rate < 800 || user.rate > 3500) {
      setError('Please enter a valid rate between 800 and 3500.');
      return false;
    }
    return true;
  }, [user.rate]);

  const checkProblemsCountValidity = useCallback(() => {
    if (user.problemsCount < 1 || user.problemsCount > 10) {
      setError('Please enter a valid number of problems between 1 and 10.');
      return false;
    }
    return true;
  }, [user.problemsCount]);

  const handleUpdate = async () => {
    if (user.handle.trim() === '') {
      setError('Please enter a Codeforces handle.');
      return;
    }

    if (!checkRateValidity() || !checkProblemsCountValidity()) {
      return;
    }

    const isValid = await checkHandleValidity();
    if (!isValid) {
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

  const renderForm = () => (
    <form className="settings__form">
      <label>
        Codeforces Handle:
        <input type="text" name="handle" value={user.handle} onChange={handleInputChange} />
      </label>
      <label>
        Rate of Problems:
        <input type="text" name="rate" value={user.rate} onChange={handleInputChange} />
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

  const renderSettings = () => (
    <div className="settings">
      {renderForm()}
      <button className="update-btn" onClick={handleUpdate}>
        Update
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );

  return (
    <div className="settings">
      <div>Settings</div>
      {renderSettings()}
    </div>
  );
};

export default Settings;
