import React, { useState, useEffect } from 'react';
import Login from './component/Login';
import Navbar from './component/Navbar';
import Home from './component/Home';
import Loader from './component/Loader';
import Settings from './component/Settings';
import './styles/App.css';

const App = () => {
  const [page, setPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(parsedUser.loggedIn);
      const fetchSolvedProblems = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(
            `https://codeforces.com/api/user.status?handle=${parsedUser.handle}`
          );
          const data = await response.json();
          const fetchedSubmissions = data.result;
          const filteredSolvedProblems = fetchedSubmissions.filter(
            (submission) => submission.verdict === 'OK'
          );
          setSolvedProblems(filteredSolvedProblems);
          setIsLoading(false);
        } catch (error) {
          console.error('An error occurred while fetching the solved problems:', error);
          setError(true);
          setIsLoading(false);
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
        setError(true);
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
      return <Loader />;
    }

    if (error) {
      return (
        <div className="server-error">
          <h1>Oops! Something went wrong.</h1>
          <p>Please try again later.</p>
        </div>
      );
    }

    if (page === 'home') return <Home problems={problems} solvedProblems={solvedProblems} />;
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
