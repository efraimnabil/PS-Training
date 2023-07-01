import React, { useState, useEffect } from 'react';
import Login from './component/Login';
import Navbar from './component/Navbar';
import Home from './component/Home';
import Problems from './component/Problems';
import Settings from './component/Settings';

import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(parsedUser.loggedIn);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };


  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };

  const renderPage = () => {
    if (page === 'home') return <Home />;
    if (page === 'problems') return <Problems />;
    if (page === 'settings') return <Settings />;
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <div>
          <Navbar setPage={setPage} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
          {renderPage()}
        </div>
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
