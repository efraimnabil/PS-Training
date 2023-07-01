import React, { useEffect, useState } from 'react';

const Home = () => {
    const [problems, setProblems] = useState([]);   // This array will contain the problems
    const [problemsCount, setProblemsCount] = useState();   // This state will contain the number of problems to be generated
    const [rateOfProblems, setRateOfProblems] = useState(); // This state will contain the rate of the problems to be generated
    const [error, setError] = useState(''); // This state will contain the error message
    const [generatedProblems, setGeneratedProblems] = useState([]); // This array will contain the generated problems

    
    useEffect(() => {   // This useEffect hook will run only once when the component is mounted
        const user = localStorage.getItem('user'); // Get the user from localStorage
        if (user) { // If the user exists, set the problemsCount and rateOfProblems states
            const parsedUser = JSON.parse(user);  // Parse the user object
            setProblemsCount(parsedUser.problemsCount); // Set the problemsCount state
            setRateOfProblems(parsedUser.rate); // Set the rateOfProblems state
        }
    }, []);

    useEffect(() => {   // This useEffect hook will run only once when the component is mounted
        const fetchProblems = async () => { // Fetch the problems from the Codeforces API
            try {   // Try to fetch the problems
                const response = await fetch(   // Fetch the problems from the Codeforces API
                    `https://codeforces.com/api/problemset.problems`
                );
                const data = await response.json(); // Parse the response to JSON
                const problems = data.result.problems; // Get the problems from the response
                setProblems(problems);  // Set the problems state
            } catch (error) {   // Catch any errors
                setError('An error occurred while fetching the problems.'); // Set the error state
            }
        };
        fetchProblems();    // Call the fetchProblems function
    }, []);

    const generateProblems = async () => {  // This function will generate the problems
        let rate = Math.round(rateOfProblems / 100) * 100;  // Round the rate
        let startRate = Math.max(800, rate - 100), endRate = Math.min(3500, rate + 100);    // Calculate the start and end rate
        let filteredProblems = problems.filter((problem) => {   // Filter the problems based on the start and end rate
            return problem.rating !== undefined && problem.rating >= startRate && problem.rating <= endRate;    // Return the problems that are in the range
        });
        let generatedProblems = []; // This array will contain the generated problems
        for (let i = 0; i < problemsCount; i++) {   // Generate the problemsCount number of problems
            let randomIndex = Math.floor(Math.random() * filteredProblems.length);  // Generate a random index
            generatedProblems.push(filteredProblems[randomIndex]);  // Push the problem at the random index to the generatedProblems array
            filteredProblems.splice(randomIndex, 1);    // Remove the problem at the random index from the filteredProblems array
        }
        setGeneratedProblems(generatedProblems);    // Set the generatedProblems state
    };

    const renderProblems = generatedProblems.map((problem) => (
        <li key={problem.contestId + problem.index}>
            <a href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`} target="_blank" rel="noreferrer">
                {problem.name}
            </a>
        </li>
    ));
    // The JSX for the Home component
    return (
        <div className="home">
            <h1> Problems </h1>
            <ul>
                {renderProblems}
            </ul>
            <button onClick={generateProblems}  className='generate-button'>
                Generate
            </button>
        </div>
    );
}

export default Home;
