import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllScores } from './scoresApiSlice';
import useAuth from "../../hooks/useAuth";
import { selectUserIdByUsername } from '../users/usersApiSlice';

const AverageScore = () => {
    const { username } = useAuth();
    const userId = useSelector(state => selectUserIdByUsername(state, username));
    const allScores = useSelector(selectAllScores);

    const averageScore = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayScores = allScores.filter(score => 
            score.user === userId && 
            new Date(score.createdAt) >= today
        );

        if (todayScores.length === 0) return 0;

        const sum = todayScores.reduce((acc, score) => acc + score.relative_score, 0);
        return Number((sum / todayScores.length).toFixed(2));
    }, [allScores, userId]);

    const rotation = useMemo(() => {
        return -90 + (averageScore / 100) * 180;
    }, [averageScore]);

    const getArcColor = (score) => {
        const colors = [
            { score: 0, color: '#FF0000' },    // Red
            { score: 25, color: '#FFA500' },   // Orange
            { score: 50, color: '#FFFF00' },   // Yellow
            { score: 75, color: '#90EE90' },   // Light Green
            { score: 100, color: '#008000' }   // Dark Green
        ];

        for (let i = 1; i < colors.length; i++) {
            if (score <= colors[i].score) {
                return colors[i].color;
            }
        }
        return colors[colors.length - 1].color;
    };

    return (
        <div className=' data-box'>
            <div className="average-score">
                <h2>Average Score Today</h2>
                <div className="speedometer">
                    <svg viewBox="0 -5 200 100" className="speedometer-svg">
                        <path
                            d="M20 80 A 60 60 0 0 1 180 80"
                            fill="none"
                            stroke="#e0e0e0"
                            strokeWidth="10"
                        />
                        <path
                            d="M20 80 A 60 60 0 0 1 180 80"
                            fill="none"
                            stroke={getArcColor(averageScore)}
                            strokeWidth="10"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 - (averageScore / 100) * 251.2}
                        />
                        <line
                            x1="100"
                            y1="80"
                            x2="100"
                            y2="30"
                            stroke="#333"
                            strokeWidth="2"
                            transform={`rotate(${rotation}, 100, 80)`}
                        />
                        <circle cx="100" cy="80" r="5" fill="#333" />
                        <text x="15" y="95" fontSize="10">0</text>
                        <text x="175" y="95" fontSize="10">100</text>
                    </svg>
                    <div className="score-value">{averageScore}</div>
                </div>
            </div>
        </div>
    );
};

export default AverageScore;