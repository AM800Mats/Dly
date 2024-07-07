import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ScoreChart from '../scores/ScoresChart';
import AverageScore from '../scores/AverageScore';
import TodayScores from '../scores/TodayScores';
import UserScoreSearch from '../scores/userScoreSearch';

const Dashboard = () => {
    const { isManager, isAdmin } = useAuth();

    return (
        <body className = "DashboardBody">
            <section className="welcome">
                <div className = "welcome1">
                    <h1>Welcome!</h1>
                </div>
                <div className="dash-grid">
                    <div className="dash-row">
                        <UserScoreSearch/>
                        <div className="data-box small">
                            <TodayScores />
                        </div>
                    </div>
                    <div className="dash-row">
                            <AverageScore />
                            <ScoreChart />
                    </div>
                </div>
                {(isManager || isAdmin) && (
                    <div className="admin-actions">
                        <h2>Admin Actions</h2>
                        <p><Link to="/dash/users">View User Settings</Link></p>
                        <p><Link to="/dash/users/new">Add New User</Link></p>
                    </div>
                )}
            </section>
        </body>
    );
};

export default Dashboard;
