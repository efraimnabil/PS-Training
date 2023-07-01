import React, { useState, useEffect } from 'react';
import Login from './component/Login';
import Navbar from './component/Navbar';
import Home from './component/Home';
import Problems from './component/Problems';
import Settings from './component/Settings';
import './App.css';

function App() {  // This component will render the entire application
  const [page, setPage] = useState('home'); // This state will contain the current page
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // This state will contain the login status

  useEffect(() => { 
    const user = localStorage.getItem('user');    // Get the user from localStorage
    if (user) {
      const parsedUser = JSON.parse(user);  // Parse the user object
      setIsLoggedIn(parsedUser.loggedIn); // Set the isLoggedIn state
    }
  }, []);

  const handleLogin = () => { // This function will handle the login
    setIsLoggedIn(true);
  };

  const handleLogout = () => {  // This function will handle the logout
    setIsLoggedIn(false);
    localStorage.clear();
  };

  const renderPage = () => {  // This function will render the current page
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
