import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllScores } from './scoresApiSlice';
import useAuth from "../../hooks/useAuth";
import { selectUserIdByUsername } from '../users/usersApiSlice';


const TodayScores = () => {
  const allScores = useSelector(selectAllScores);
  const { username } = useAuth();
  const userId = useSelector(state => selectUserIdByUsername(state, username));


  // Helper function to check if a date is today
  const isToday = (dateString) => {
    const today = new Date();
    const createdDate = new Date(dateString);
    return createdDate.getDate() === today.getDate() &&
           createdDate.getMonth() === today.getMonth() &&
           createdDate.getFullYear() === today.getFullYear();
  };

  const isCorrectUser = (user) => {
    return user === userId
  }

  // Filter and sort today's scores
  const todayScores = allScores
    .filter(score => isToday(score.createdAt) && isCorrectUser(score.user))
    .sort((a, b) => b.relative_score - a.relative_score);

  // New color calculation function
  const getBarColor = (relativeScore) => {
    const colors = [
      { score: 0, color: { r: 255, g: 0, b: 0 } },    // Red
      { score: 25, color: { r: 255, g: 165, b: 0 } }, // Orange
      { score: 50, color: { r: 255, g: 255, b: 0 } }, // Yellow
      { score: 75, color: { r: 144, g: 238, b: 144 } },// Light Green
      { score: 100, color: { r: 0, g: 128, b: 0 } }   // Dark Green
    ];

    const getColorAtPosition = (colors, score) => {
      for (let i = 1; i < colors.length; i++) {
        if (score <= colors[i].score) {
          const lowColor = colors[i - 1].color;
          const highColor = colors[i].color;
          const range = colors[i].score - colors[i - 1].score;
          const scaledScore = (score - colors[i - 1].score) / range;

          const r = Math.round(lowColor.r + (highColor.r - lowColor.r) * scaledScore);
          const g = Math.round(lowColor.g + (highColor.g - lowColor.g) * scaledScore);
          const b = Math.round(lowColor.b + (highColor.b - lowColor.b) * scaledScore);

          return `rgb(${r}, ${g}, ${b})`;
        }
      }
      return `rgb(0, 128, 0)`; // Default to dark green if score > 100
    };

    return getColorAtPosition(colors, relativeScore);
  };

  return (
    <div className="today-scores">
      <h2>Scores Today</h2>
      {todayScores.length === 0 ? (
        <p>No scores recorded today.</p>
      ) : (
        <ul className="score-list">
          {todayScores.map((score) => (
            <li key={score.id} className="score-item">
              <div className="score-info">
                <span className="game-name">{score.game || 'Unknown Game'}</span>
                <span className="absolute-score">Score: {score.absolute_score}</span>
                <span className="relative-score">Relative: {score.relative_score}%</span>
              </div>
              <div className="score-bar-container">
                <div 
                  className="score-bar" 
                  style={{
                    width: `${score.relative_score}%`,
                    backgroundColor: getBarColor(score.relative_score)
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodayScores;