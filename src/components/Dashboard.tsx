import { useNavigate } from "react-router-dom";

import React, { useState, useEffect } from 'react';
import Decklist, { Decklist_t } from './Decklist';

import { Grid, Typography, Fab, Dialog, DialogContent, DialogTitle, DialogContentText, Button, DialogActions, TextField, FormControlLabel, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { requestPath } from "../utils";

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
        fetch(`${requestPath}/decks/?user_id=-1`, {
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
                setdisplayDeckList(true);
                setDeckList(data);
            });
        });
    }

    const deckListHTML = () => {
        if (displayDeckList) {
            return <Decklist data={deckList} updateMethod={getDeckList} mine={true}/>
        } else {
            getDeckList();
            return null
        }
    }

    const logout = () => {
        //TODO - KURWA MICHAAAAAŁ
        fetch(`${requestPath}/auth/logout/`, {
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

    const createDeck = (event: any) => {
        console.log(event);
        event.preventDefault();
        handleCloseForm();
        fetch(`${requestPath}/decks/`, {
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("token"),
            },

            body: JSON.stringify({ // TODO - testing
                name: event.target.name.value,
                private: privateDeck,
            })
        })
        .then((response) => {
            if (!response.ok) {
                console.log("Error") // TODO
                return;
            }

            response.json().then((data) => {
                navigate(`/deckView/${data.id}`);
            });
        });
    }

    const [showForm, setShowForm] = useState(false);
    const [privateDeck, setPrivateDeck] = useState(false);

    const handleOpenForm = () => setShowForm(true);
    const handleCloseForm = () => setShowForm(false);
    const changePrivacyCheckbox = (event: any) => setPrivateDeck(event.target.checked);

    const newDeckForm = (
        <Dialog open={showForm} onClose={handleCloseForm}>
            <DialogTitle id="create-dialog">
                Create a new deck
            </DialogTitle>

            <DialogContent>
                <form id="create-deck-form" onSubmit={createDeck} >
                    <TextField id="deck-name-input" name="name" label="Deck name" type="text" fullWidth required sx={{ marginTop: '0.5rem' }} />
                    <FormControlLabel
                        control={<Checkbox value="private" color="primary" onChange={changePrivacyCheckbox}/>}
                        label="Private"
                    />
                </form>
            </DialogContent>

            <DialogActions>
                <Button variant="contained" color="success" type="submit" form="create-deck-form"> Create </Button>
                <Button variant="contained" color="error" onClick={handleCloseForm} autoFocus> Cancel </Button>
            </DialogActions>
      </Dialog>
    )

    const dashboardHTML = (
        <div>
            <Typography variant="h3" sx = {{padding: 6, width: "100%", display: "flex", justifyContent: "center"}}>
                Dashboard
            </Typography>
            <div style = {{padding: 5, paddingTop: 0, display: "flex", alignItems: "center", justifyContent: "center"}}>
                {deckListHTML()}

                <Fab color="primary" sx = {{ position: "fixed", right: "min(4rem, 10vw)", bottom: "min(4rem, 10vw)", padding: "2.5rem" }} onClick={handleOpenForm}>
                    <AddIcon fontSize="large"/>
                </Fab>

                {newDeckForm}
            </div>
        </div>
    )

    return (
        authenticated ? dashboardHTML : <h1>Not authenticated</h1> // TODO - redirect to login
    );
}

export default Dashboard;