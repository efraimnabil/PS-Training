import React, { useEffect, useState } from 'react';

const Home = ({ problems, solvedProblems }) => {
  const [problemsCount, setProblemsCount] = useState();
  const [rateOfProblems, setRateOfProblems] = useState();
  const [handle, setHandle] = useState('');
  const [generatedProblems, setGeneratedProblems] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setProblemsCount(parsedUser.problemsCount);
      setRateOfProblems(parsedUser.rate);
      setHandle(parsedUser.handle);
    }

    const storedGeneratedProblems = localStorage.getItem('generatedProblems');
    if (storedGeneratedProblems) {
      const parsedGeneratedProblems = JSON.parse(storedGeneratedProblems);
      setGeneratedProblems(parsedGeneratedProblems);
    } else {
      setGeneratedProblems([]);
    }
  }, []);

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
    let solvedProblemsIds = solvedProblems.map((problem) => problem.problem.contestId + problem.problem.index);
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
        if (solvedProblems.some((problem) => problem.problem.contestId === parsedGeneratedProblems[i].contestId && problem.problem.index === parsedGeneratedProblems[i].index)) {
          solvedProblemsCount++;
        }
      }
      if (solvedProblemsCount > 0){
        const parsedUser = JSON.parse(storedUser);
        parsedUser.rate = Math.min(3500, parsedUser.rate + solvedProblemsCount * 10);
        localStorage.setItem('user', JSON.stringify(parsedUser));
        setRateOfProblems(parsedUser.rate);
      }
      else{
        const parsedUser = JSON.parse(storedUser);
        parsedUser.rate = Math.max(800, parsedUser.rate - 10);
        localStorage.setItem('user', JSON.stringify(parsedUser));
        setRateOfProblems(parsedUser.rate);
      }
    }
  }

  const renderProblems = generatedProblems.length ? (
    generatedProblems.map((problem, index) => (
      <li key={`${problem.contestId}${problem.index}${index}`}>
        <a
          href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
          target="_blank"
          rel="noreferrer"
        >
          {problem.name}
        </a>
      </li>
    ))
  ) : (
    <li>No problems generated.</li>
  );

  return (
    <div className="home">
      <h1>Problems</h1>
      <ul>{renderProblems}</ul>
      <button onClick={generateProblems} className="generate-button">
        Generate
      </button>
    </div>
  );
};

export default Home;
