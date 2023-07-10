import React, { useEffect, useState } from 'react';
import cupe from './../images/cupe.webp';
import './../styles/Home.css';

const Home = ({ problems, solvedProblems }) => {
  const [problemsCount, setProblemsCount] = useState();
  const [rateOfProblems, setRateOfProblems] = useState();
  const [generatedProblems, setGeneratedProblems] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setProblemsCount(parsedUser.problemsCount);
      setRateOfProblems(parsedUser.rate);
    }

    const storedGeneratedProblems = localStorage.getItem('generatedProblems');
    if (storedGeneratedProblems) {
      const parsedGeneratedProblems = JSON.parse(storedGeneratedProblems);
      setGeneratedProblems(parsedGeneratedProblems);
    } else {
      setGeneratedProblems([]);
    }
  }, []);

  useEffect(() => {
    const storedGeneratedProblems = localStorage.getItem('generatedProblems');
    if (storedGeneratedProblems) {
      const parsedGeneratedProblems = JSON.parse(storedGeneratedProblems);
      for (let i = 0; i < parsedGeneratedProblems.length; i++) {
        if ( solvedProblems.some( problem => problem.problem.contestId === parsedGeneratedProblems[i].contestId && problem.problem.index === parsedGeneratedProblems[i].index)) {
          parsedGeneratedProblems[i].solved = true;
        } else {
          parsedGeneratedProblems[i].solved = false;
        }
      }
      localStorage.setItem('generatedProblems', JSON.stringify(parsedGeneratedProblems));
      setGeneratedProblems(parsedGeneratedProblems);
    }
  }, [solvedProblems]);


  const generateProblems = () => {
    let rate = Math.round(rateOfProblems / 100) * 100;
    let startRate = Math.max(800, rate - 100);
    let endRate = Math.min(3500, rate + 100);

    let filteredProblems = problems.filter((problem) => {
      return (
        problem.rating !== undefined &&
        problem.rating >= startRate &&
        problem.rating <= endRate
      );
    });
    updateRate();

    let generatedProblems = [];
    let solvedProblemsIds = solvedProblems.map(
      (problem) => problem.problem.contestId + problem.problem.index
    );
    let solvedProblemsSet = new Set(solvedProblemsIds);
    let randomIndex = Math.floor(Math.random() * filteredProblems.length);
    let randomProblem = filteredProblems[randomIndex];
    while (generatedProblems.length < problemsCount) {
      if (!solvedProblemsSet.has(randomProblem.contestId + randomProblem.index)) {
        generatedProblems.push(randomProblem);
      }
      randomIndex = Math.floor(Math.random() * filteredProblems.length);
      randomProblem = filteredProblems[randomIndex];
    }

    localStorage.setItem('generatedProblems', JSON.stringify(generatedProblems));

    setGeneratedProblems(generatedProblems);
  };

  const updateRate = () => {
    const storedGeneratedProblems = localStorage.getItem('generatedProblems');
    const storedUser = localStorage.getItem('user');
    let solvedProblemsCount = 0;
    if (storedGeneratedProblems && storedUser) {
      const parsedGeneratedProblems = JSON.parse(storedGeneratedProblems);
      for (let i = 0; i < parsedGeneratedProblems.length; i++) {
        if (
          solvedProblems.some(
            (problem) =>
              problem.problem.contestId === parsedGeneratedProblems[i].contestId &&
              problem.problem.index === parsedGeneratedProblems[i].index
          )
        ) {
          solvedProblemsCount++;
        }
      }
      if (solvedProblemsCount > 0) {
        const parsedUser = JSON.parse(storedUser);
        parsedUser.rate = Math.min(3500, parsedUser.rate + solvedProblemsCount * 10);
        localStorage.setItem('user', JSON.stringify(parsedUser));
        setRateOfProblems(parsedUser.rate);
      } else {
        const parsedUser = JSON.parse(storedUser);
        parsedUser.rate = Math.max(800, parsedUser.rate - 10);
        localStorage.setItem('user', JSON.stringify(parsedUser));
        setRateOfProblems(parsedUser.rate);
      }
    }
  };

  const renderProblems = generatedProblems.length ? (
    generatedProblems.map((problem, index) => (
      <li
        key={`${problem.contestId}${problem.index}${index}`}
        className={`problem ${problem.solved ? 'solved' : ''}`}
      >
        <a
          href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
          target="_blank"
          rel="noreferrer"
          className="problem-link"
        >
          {problem.name}
        </a>
        {problem.solved && <span className="done">✅</span>}
      </li>
    ))
  ) : (
    <li className="no-problems">No problems generated</li>
  );

  return (
    <div className="home">
      <div className="rate">
        <span className="rate__text">Rate: </span>
        <span className="rate__value">{rateOfProblems}</span>
      </div>
      <div className={generatedProblems.length === 0 ? 'shape-4 hidden' : 'shape-4'}>
        <img src={cupe} alt="cupe" />
      </div>
      <div className="home-content">
        <ul className="problems">{renderProblems}</ul>
        <button onClick={generateProblems} className="generate-button">
          Generate
        </button>
      </div>
    </div>
  );
};

export default Home;
