import React, { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { useGetScoresQuery, selectAllScores } from './scoresApiSlice';
import useAuth from "../../hooks/useAuth";
import { selectUserIdByUsername, useGetUsersQuery } from '../users/usersApiSlice';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ScoreChart = () => {
    const defaultGame = 'Globle';
    const [selectedGame, setSelectedGame] = useState(defaultGame);
    const [filteredScores, setFilteredScores] = useState([]);
    const { username } = useAuth();

    const { isSuccess: isUsersSuccess } = useGetUsersQuery();
    const { isSuccess: isScoresSuccess } = useGetScoresQuery();

    const userId = useSelector(state => selectUserIdByUsername(state, username));
    const allScores = useSelector(selectAllScores);

    useEffect(() => {
        if (isScoresSuccess && selectedGame && userId) {
            const userScores = allScores.filter(score => 
                score.user === userId && score.game === selectedGame
            );
            const sortedScores = userScores
                .slice(-50)
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setFilteredScores(sortedScores);
        }
    }, [isScoresSuccess, selectedGame, userId, allScores]);

    const handleGameChange = (event) => {
        setSelectedGame(event.target.value);
    };

    const gameOptions = useMemo(() => {
        return [...new Set(allScores.map(score => score.game))];
    }, [allScores]);

    const data = {
        labels: filteredScores.map(score => new Date(score.createdAt).toLocaleDateString()),
        datasets: [
            {
                label: 'Absolute Score',
                data: filteredScores.map(score => score.absolute_score),
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            }
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Score'
                }
            }
        }
    };

    if (!isUsersSuccess || !isScoresSuccess) {
        return <div>Loading...</div>;
    }

    return (
        <div className='data-box large bottom'>
            <div className='score-chart'>
                <div>
                    <label htmlFor="game">Select Game: </label>
                    <select className = "select" id="game" value={selectedGame} onChange={handleGameChange}>
                        <option value="">Select a game</option>
                        {gameOptions.map(game => (
                            <option key={game} value={game}>{game}</option>
                        ))}
                    </select>
                </div>
                {filteredScores.length > 0 ? (
                    <div className = "ScoreGraphs">
                        <Line data={data} options={options} />
                    </div>
                ) : (
                    <p>No scores available for the selected game.</p>
                )}
            </div>
        </div>
    );
};

export default ScoreChart;
