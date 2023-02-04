import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, TextField, Dialog, DialogTitle, DialogContent, FormControlLabel, IconButton, Grid, DialogActions, Button, Fab, Checkbox } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { requestPath } from "../utils";
import NavBar from "./NavBar";
import { ImageAspectRatio } from "@mui/icons-material";
import Stack from '@mui/material/Stack';
import { NumberLiteralType } from "typescript";
import PublicDeck from "./PublicDeck";
import { Deck_t } from "./Deck";
import Deck from "./Deck";
import Decklist from "./Decklist";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { LoginContext } from './LoginContext';
import AddIcon from '@mui/icons-material/Add';




export function UserDecks() {
    const [decks, setDecks] = useState([]);
    const [page, setPage] = useState(1);
    const [nextPage, setNextPage] = useState(false);
    const { login } = useContext(LoginContext)
    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);
    const [privateDeck, setPrivateDeck] = useState(false);

    const handleOpenForm = () => setShowForm(true);
    const handleCloseForm = () => setShowForm(false);
    const changePrivacyCheckbox = (event: any) => setPrivateDeck(event.target.checked);

    const getDecks = async() => {
        const decksLikeInfix = await fetch(`${requestPath}/decks/?page=${page}&user_id=${-1}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        });

        if (!decksLikeInfix.ok) {
            console.log("Error") //TODO
            setDecks([]);
            return;
        }

        const decksLikeInfixJson = await decksLikeInfix.json();

        setDecks(decksLikeInfixJson);

        const checkNextPage = await fetch(`${requestPath}/decks/?page=${page+1}&user_id=${-1}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        });

        if (!checkNextPage.ok) {
            setNextPage(false);
            return;
        }

        const nextPageJson = await checkNextPage.json();
        
        setNextPage(nextPageJson.length > 0);

    }

    useEffect(()=>{
        getDecks();
        console.log(localStorage.getItem("token"));
    }, [page, login]);

    const incrementPage = () => {
        setPage(page + 1);
    }

    const decrementPage = () => {
        setPage(page - 1);
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
                format: "Standard"
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


    if(login) {
    return (<div>
            <Typography variant="h3" sx = {{padding: 6, width: "100%", display: "flex", justifyContent: "center"}}>
                {page > 1?
                <IconButton aria-label="delete" onClick={decrementPage} sx = {{width: 48, height: 48, marginTop: 0}}>
                    <NavigateBeforeIcon/>
                </IconButton> :
                <div style = {{width: 48}}></div>}
                Your decks
                {nextPage ?
                <IconButton aria-label="delete" onClick={incrementPage} sx = {{width: 48, height: 48, marginTop: 0}}>
                    <NavigateNextIcon />
                </IconButton> :
                <div style = {{width: 48}}></div>}
            </Typography>
            <Decklist data={decks} updateMethod={getDecks} mine={true}/>
            <Fab color="primary" sx = {{ position: "fixed", right: "min(4rem, 10vw)", bottom: "min(4rem, 10vw)", padding: "2.5rem" }} onClick={handleOpenForm}>
                    <AddIcon fontSize="large"/>
                </Fab>

            {newDeckForm}
    </div>
    )} else {
        return <Typography variant="h3" sx = {{padding: 6, width: "100%", display: "flex", justifyContent: "center"}}>
        Log in to view your decks
    </Typography>
    }


}