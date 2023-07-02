import React, { useState, useEffect } from 'react';
import Login from './component/Login';
import Navbar from './component/Navbar';
import Home from './component/Home';
import Problems from './component/Problems';
import Settings from './component/Settings';
import './App.css';

const App = () => {
  const [page, setPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(parsedUser.loggedIn);
    }
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch(
          `https://codeforces.com/api/problemset.problems`
        );
        const data = await response.json();
        const fetchedProblems = data.result.problems;
        setProblems(fetchedProblems);
        setIsLoading(false);
      } catch (error) {
        console.error('An error occurred while fetching the problems.');
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };

  const renderPage = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (page === 'home') return <Home problems={problems} />;
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
};

export default App;
