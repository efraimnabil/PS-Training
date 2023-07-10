import React, { useState, useEffect, useCallback } from 'react';
import './../styles/Settings.css';

const Settings = () => {
  const [user, setUser] = useState({
    handle: '',
    rate: '',
    problemsCount: ''
  });

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
    if (isNaN(user.rate) || user.rate < 800 || user.rate > 3500) {
      return true;
    }
    return false;
  }, [user.rate]);

  const checkProblemsCountValidity = useCallback(() => {
    if (isNaN(user.problemsCount) || user.problemsCount < 1 || user.problemsCount > 10) {
      return true;
    }
    return false;
  }, [user.problemsCount]);

  const handleUpdate = async () => {
    let handleNotValid = false, rateNotValid = false, problemsCountNotValid = false;
    if (user.handle.trim() === '') {
      handleNotValid = true;
    }
    if (user.rate.trim() === '' || checkRateValidity()) {
      rateNotValid = true;
    }

    if (user.problemsCount.trim() === '' || checkProblemsCountValidity()) {
      problemsCountNotValid = true;
    }

    const handleValidityErrors = await checkHandleValidity();
    if (handleValidityErrors.length > 0) {
      handleNotValid = true;
    }
    let handleDocLabel = document.querySelector('.handle-label'), 
        rateDocLabel = document.querySelector('.rate-label'),
        problemsDocLabel = document.querySelector('.problems-label'),
        handleDocInput = document.querySelector('.handle-input'),
        rateDocInput = document.querySelector('.rate-input'),
        problemsDocInput = document.querySelector('.problems-input');


    if(handleNotValid){
      handleDocLabel.style.color = 'red';
      handleDocLabel.innerHTML = 'Invalid Handle';
      handleDocInput.style.border = '1px solid red';
    }
    else{
      handleDocLabel.style.color = 'green';
      handleDocLabel.innerHTML = 'Codeforces Handle';
      handleDocInput.style.border = '1px solid green';
    }
    if(rateNotValid){
      rateDocLabel.style.color = 'red';
      rateDocLabel.innerHTML = 'Invalid Rate';
      rateDocInput.style.border = '1px solid red';
    }
    else{
      rateDocLabel.style.color = 'green';
      rateDocLabel.innerHTML = 'Rate of Problems';
      rateDocInput.style.border = '1px solid green';
    }
    if(problemsCountNotValid){
      problemsDocLabel.style.color = 'red';
      problemsDocLabel.innerHTML = 'Invalid Number of Problems';
      problemsDocInput.style.border = '1px solid red';
    }
    else{
      problemsDocLabel.style.color = 'green';
      problemsDocLabel.innerHTML = 'Number of Problems';
      problemsDocInput.style.border = '1px solid green';
    }
    if (handleNotValid || rateNotValid || problemsCountNotValid) {
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
      <label className='handle-label'>
        Codeforces Handle
      </label>
      <input type="text" name="handle" value={user.handle} onChange={handleInputChange} className='handle-input' />
      <label className='rate-label'>
        Rate of Problems
      </label>
      <input type="text" name="rate" value={user.rate} onChange={handleInputChange} className='rate-input' />
      <label className='problems-label'>
        Number of Problems
      </label>
        <input
          type="text"
          name="problemsCount"
          className='problems-input'
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
    <div className="containerr">
      {renderSettings()}
    </div>
  );
};

export default Settings;
