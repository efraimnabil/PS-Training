import React, { useEffect, useState } from 'react';

const Home = () => {
    const [numberOfProblems, setNumberOfProblems] = useState(6);
    const [rateOfProblems, setRateOfProblems] = useState(900);
    const [problems, setProblems] = useState([]);

    const generateProblems = () => {
        fetch(`http://127.0.0.1:8000/api/get-new-task/${rateOfProblems}/${numberOfProblems}/`)
            .then(response => response.json())
            .then(data => {
                setProblems(data.Task.problems);
                localStorage.setItem('problems', JSON.stringify(data.Task.problems));
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        const storedProblems = JSON.parse(localStorage.getItem('problems'));
        if (storedProblems) {
            setProblems(storedProblems);
        } else {
            generateProblems();
        }
    }, []);

    return (
        <div className="home">
            <h1> Problems </h1>
            <ul>
                {
                    problems.map((problem) => (   
                        <a href={problem.url}>
                            <li key={problem.id}>
                            <aside className="problem">
                                <span>Problem Name: </span>
                                <span>Rate: </span>
                            </aside>
                            <aside className="problem">
                                <span>{problem.name}</span>
                                <span>{problem.rate}</span>
                            </aside>
                        </li>
                        </a>
                    ))
                }
            </ul>
            <button 
            onClick={generateProblems}
            className='generate-button'
            >Generate</button>
        </div>
    );
}

export default Home;
