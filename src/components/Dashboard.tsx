import React from 'react';

function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
            <h2>You logged in succesfully!</h2>
            <h3>Your secret token is {localStorage.getItem("token")}</h3>
        </div>
    );
}

export default Dashboard;