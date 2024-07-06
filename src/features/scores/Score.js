import React from 'react';
import { useSelector } from 'react-redux';
import { selectScoreById } from './scoresApiSlice';

const Score = ({ scoreId }) => {
    const score = useSelector(state => selectScoreById(state, scoreId));

    if (!score) {
        return null; // Handle case where score is not yet loaded or doesn't exist
    }

    return (
        <tr className="table__row score">
            <td className="table__cell">{score.user}</td>
            <td className="table__cell">{score.game}</td>
            <td className="table__cell">{score.absolute_score}</td>
            <td className="table__cell">{score.relative_score}</td>
            <td className="table__cell">{score.id}</td>
        </tr>
    );
};

export default Score;
