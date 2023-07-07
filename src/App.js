import React, { useState, useEffect } from 'react';
import Login from './component/Login';
import Navbar from './component/Navbar';
import Home from './component/Home';
import Problems from './component/Problems';
import Settings from './component/Settings';
import './styles/App.css';

const App = () => {
  const [page, setPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(parsedUser.loggedIn);
      const fetchSolvedProblems = async () => {
        try {
          const response = await fetch(
            `https://codeforces.com/api/user.status?handle=${parsedUser.handle}`
          );
          const data = await response.json();
          const fetchedSubmissions = data.result;
          const filteredSolvedProblems = fetchedSubmissions.filter(
            (submission) => submission.verdict === 'OK'
          );
          setSolvedProblems(filteredSolvedProblems);
        } catch (error) {
          console.error('An error occurred while fetching the solved problems:', error);
        }
      };
      fetchSolvedProblems();
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
        console.error('An error occurred while fetching the problems:', error);
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const renderPage = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (page === 'home') return <Home problems={problems} solvedProblems={solvedProblems} />;
    if (page === 'problems') return <Problems />;
    if (page === 'settings') return <Settings />;
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <div>
          <Navbar setPage={setPage} isLoggedIn={isLoggedIn} />
          {renderPage()}
        </div>
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
