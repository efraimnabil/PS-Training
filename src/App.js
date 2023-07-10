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
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [errorServer, setErrorServer] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(parsedUser.loggedIn);
      const fetchSolvedProblems = async () => {
        try {
          setIsLoading1(true);
          const response = await fetch(
            `https://codeforces.com/api/user.status?handle=${parsedUser.handle}`
          );
          const data = await response.json();
          const fetchedSubmissions = data.result;
          const filteredSolvedProblems = fetchedSubmissions.filter(
            (submission) => submission.verdict === 'OK'
          );
          setSolvedProblems(filteredSolvedProblems);
          setIsLoading1(false);
          setErrorServer(false);
        } catch (error) {
          console.error('An error occurred while fetching the solved problems:', error);
          setErrorServer(true);
          setIsLoading1(false);
        }
      };
      fetchSolvedProblems();
    }
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading2(true);
        const response = await fetch(
          `https://codeforces.com/api/problemset.problems`
        );
        const data = await response.json();
        const fetchedProblems = data.result.problems;
        setProblems(fetchedProblems);
        setIsLoading2(false);
        setErrorServer(false);
      } catch (error) {
        console.error('An error occurred while fetching the problems:', error);
        setErrorServer(true);
        setIsLoading2(false);
      }
    };

    fetchProblems();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    window.location.reload();
  };

  const renderPage = () => {
    if (isLoading1 || isLoading2) {
      return <Loader />;
    }

    if (errorServer) {
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
      <div className="author-info">
        <p>
          Made with <span>❤</span> by{' '}
          <a
          href="https://www.linkedin.com/in/efraimnabil/"
          target="_blank"
          rel="noreferrer"
          >Efraim Nabil</a>
        </p>
      </div>
    </div>
  );
};

export default App;
