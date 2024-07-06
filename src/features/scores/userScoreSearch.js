import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetScoresQuery, selectAllScores } from './scoresApiSlice';
import { useGetUsersQuery, selectUserIdByUsername, selectAllUsers } from '../users/usersApiSlice';

const UserScoreSearch = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [todayScores, setTodayScores] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [displayUsers, setDisplayUsers] = useState([]);

    const { isSuccess: isUsersSuccess } = useGetUsersQuery();
    const { isSuccess: isScoresSuccess } = useGetScoresQuery();

    const allScores = useSelector(selectAllScores);
    const allUsers = useSelector(selectAllUsers);

    useEffect(() => {
        if (isScoresSuccess && selectedUser) {
            const userId = allUsers.find(user => user.username === selectedUser)?.id;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayUserScores = allScores.filter(score =>
                score.user === userId && new Date(score.createdAt) >= today
            );
            setTodayScores(todayUserScores);
        }
    }, [isScoresSuccess, selectedUser, allUsers, allScores]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = allUsers.filter(user =>
                user.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setDisplayUsers(filtered);
        } else {
            setDisplayUsers([]);
        }
    }, [searchQuery, allUsers]);

    const handleUserSelect = (username) => {
        setSelectedUser(username);
        setSearchQuery('');
        setDisplayUsers([]);
    };

    const totalDailyAverage = useMemo(() => {
        if (todayScores.length === 0) return 0;
        const sum = todayScores.reduce((acc, score) => acc + score.relative_score, 0);
        return Number((sum / todayScores.length).toFixed(2));
    }, [todayScores]);

    const rotation = useMemo(() => {
        return -90 + (totalDailyAverage / 100) * 180;
    }, [totalDailyAverage]);

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

    if (!isUsersSuccess || !isScoresSuccess) {
        return <div>Loading...</div>;
    }

    return (
        <div className='data-box large'>
            <div className='score-search'>
                <div>
                    <label htmlFor="userSearch">Search User: </label>
                    <input
                        type="text"
                        id="userSearch"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoComplete="off"
                    />
                    {displayUsers.length > 0 && (
                        <ul className="autocomplete-results">
                            {displayUsers.map(user => (
                                <li key={user.id} onClick={() => handleUserSelect(user.username)}>
                                    {user.username}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {selectedUser && (
                    <>
                        <h2>{selectedUser}'s Today's Scores</h2>
                        <div className="average-score">
                            <h2>Today's Average Relative Score</h2>
                            <div className="speedometer">
                                <svg viewBox="0 0 200 100" className="speedometer-svg">
                                    <path
                                        d="M20 80 A 60 60 0 0 1 180 80"
                                        fill="none"
                                        stroke="#e0e0e0"
                                        strokeWidth="10"
                                    />
                                    <path
                                        d="M20 80 A 60 60 0 0 1 180 80"
                                        fill="none"
                                        stroke={getArcColor(totalDailyAverage)}
                                        strokeWidth="10"
                                        strokeDasharray="251.2"
                                        strokeDashoffset={251.2 - (totalDailyAverage / 100) * 251.2}
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
                                    <text x="20" y="95" fontSize="10">0</text>
                                    <text x="180" y="95" fontSize="10">100</text>
                                </svg>
                                <div className="score-value">{totalDailyAverage}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserScoreSearch;
