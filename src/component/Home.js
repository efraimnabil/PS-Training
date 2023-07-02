import React, { useEffect, useState } from 'react';

const Home = ({ problems }) => {
  const [problemsCount, setProblemsCount] = useState(); // State to hold the number of problems
  const [rateOfProblems, setRateOfProblems] = useState(); // State to hold the rate of problems
  const [handle, setHandle] = useState(''); // State to hold the handle
  const [generatedProblems, setGeneratedProblems] = useState([]); // State to hold the generated problems

  useEffect(() => {
    // Fetch user data from localStorage when the component mounts
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setProblemsCount(parsedUser.problemsCount);
      setRateOfProblems(parsedUser.rate);
      setHandle(parsedUser.handle);
    }

    // Fetch generated problems from localStorage when the component mounts
    const storedGeneratedProblems = localStorage.getItem('generatedProblems');
    if (storedGeneratedProblems) {
      const parsedGeneratedProblems = JSON.parse(storedGeneratedProblems);
      setGeneratedProblems(parsedGeneratedProblems);
    } else {
      setGeneratedProblems([]);
    }
  }, []);

  const generateProblems = () => {
    // Calculate the rate range for problem filtering
    let rate = Math.round(rateOfProblems / 100) * 100;
    let startRate = Math.max(800, rate - 100);
    let endRate = Math.min(3500, rate + 100);

    // Filter problems based on the rate range
    let filteredProblems = problems.filter((problem) => {
      return (
        problem.rating !== undefined &&
        problem.rating >= startRate &&
        problem.rating <= endRate
      );
    });

    // Generate random problems from the filtered list
    let generatedProblems = [];
    for (let i = 0; i < problemsCount; i++) {
      let randomIndex = Math.floor(Math.random() * filteredProblems.length);
      generatedProblems.push(filteredProblems[randomIndex]);
      filteredProblems.splice(randomIndex, 1);
    }

    // Save generatedProblems to localStorage
    localStorage.setItem('generatedProblems', JSON.stringify(generatedProblems));

    // Update the state with the generated problems
    setGeneratedProblems(generatedProblems);
  };

  const renderProblems = generatedProblems.length ? (
    generatedProblems.map((problem) => (
      <li key={problem.contestId + problem.index}>
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
