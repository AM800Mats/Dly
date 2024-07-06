import React from 'react';
import { useGetScoresQuery } from './scoresApiSlice';
import Score from './Score';

const ScoresList = () => {
    const { data: scores, isLoading, isSuccess, isError, error } = useGetScoresQuery('scoresList', {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let content;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    } else if (isSuccess) {
        const { data: scoreIds } = scores;

        const tableContent = scoreIds?.map(scoreId => <Score key={scoreId} scoreId={scoreId} />);

        content = (
            <table className="table table--scores">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th score__user">User</th>
                        <th scope="col" className="table__th score__game">Game</th>
                        <th scope="col" className="table__th score__absolute">Absolute Score</th>
                        <th scope="col" className="table__th score__relative">Relative Score</th>
                        <th scope="col" className="table__th score__id">ID</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        );
    }

    return content;
};

export default ScoresList;
