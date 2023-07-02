import React, { useEffect, useState } from 'react';

const Home = ({ problems }) => {
  const [problemsCount, setProblemsCount] = useState();                 // This state will contain the number of problems
  const [rateOfProblems, setRateOfProblems] = useState();               // This state will contain the rate of problems 
  const [handle, sethandle] = useState('');                             // This state will contain the handle
  const [generatedProblems, setGeneratedProblems] = useState([]);       // This state will contain the generated problems

  useEffect(() => {                                                     // This effect will run when the component mounts
    const user = localStorage.getItem('user');                          // Get the user from localStorage
    if (user) {
      const parsedUser = JSON.parse(user);
      setProblemsCount(parsedUser.problemsCount);
      setRateOfProblems(parsedUser.rate);
      sethandle(parsedUser.handle);
    }
  }, []);

  const generateProblems = () => {                                      // This function will generate the problems
    let rate = Math.round(rateOfProblems / 100) * 100;                  // Round the rate to the nearest 100
    let startRate = Math.max(800, rate - 100), endRate = Math.min(3500, rate + 100);
    let filteredProblems = problems.filter((problem) => {               // Filter the problems based on the rate
      return (  
        problem.rating !== undefined &&
        problem.rating >= startRate &&
        problem.rating <= endRate
      );
    });
    let generatedProblems = []; 
    for (let i = 0; i < problemsCount; i++) {   
      let randomIndex = Math.floor(Math.random() * filteredProblems.length);
      generatedProblems.push(filteredProblems[randomIndex]);
      filteredProblems.splice(randomIndex, 1);
    }
    setGeneratedProblems(generatedProblems);
  };
    
  const renderProblems = generatedProblems.map((problem) => (
    <li key={problem.contestId + problem.index}>
      <a
        href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
        target="_blank"
        rel="noreferrer"
      >
        {problem.name}
      </a>
    </li>
  ));

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
