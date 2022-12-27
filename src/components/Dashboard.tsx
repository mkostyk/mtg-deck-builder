import { useNavigate } from "react-router-dom";

import React, { useState, useEffect } from 'react';
import Decklist, { Decklist_t } from './Decklist';

function Dashboard() {
    const [authenticated, setauthenticated] = useState(false);
    const [displayDeckList, setdisplayDeckList] = useState(false);
    const [deckList, setDeckList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token") || "null";
        if (token !== "null") {
            setauthenticated(true);
        }
    }, []);

    const getDeckList = () => {
        fetch('http://localhost:8000/decks/?user_id=-1', {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        })
        .then((response) => {
            if (!response.ok) {
                // TODO - wrong token
                console.log("Error") // TODO
                return;
            }

            response.json().then((data) => {
                setdisplayDeckList(true)!;
                setDeckList(data);
            });
        });
    }

    const deckListHTML = () => {
        if (displayDeckList) {
            return <Decklist data={deckList} />
        } else {
            return null
        }
    }

    const logout = () => {
        fetch('http://localhost:8000/auth/logout/', {
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        })
        .then((response) => {
            if (!response.ok) {
                console.log("Error") // TODO
                return;
            }

            localStorage.removeItem("token");
            setauthenticated(false);
            navigate("/login");
        });
    }

    const dashboardHTML = (
        <div>
            <h1>Dashboard</h1>
            <h2>You logged in succesfully!</h2>
            <h3>Your secret token is {localStorage.getItem("token")}</h3>
            <button onClick={getDeckList}>Get deck list</button>
            <button onClick={logout}>Logout</button>
            {deckListHTML()}
        </div>
    )

    return (
        authenticated ? dashboardHTML : <h1>Not authenticated</h1>
    );
}

export default Dashboard;