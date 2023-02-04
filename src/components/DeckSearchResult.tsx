import Decklist from "./Decklist";
import { useState, useEffect } from "react";
import { requestPath } from "../utils";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Box, Typography, TextField, Input, CssBaseline, Container, InputAdornment, IconButton, Grid, imageListClasses, Button } from '@mui/material';

function DeckSearchResult() {
    const [decks, setDecks] = useState([]);
    const [page, setPage] = useState(1);
    const [nextPage, setNextPage] = useState(false);

    useEffect(() => {
        fetchDecks();
    }, [page])

    const fetchDecks = async () => {

        const token = localStorage.getItem("token");
        const request = localStorage.getItem("request");

        let decksLikeInfix: any;
        if (token != null) {

            decksLikeInfix = await fetch(`${requestPath}/decks/${request}&page=${page}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem("token")
                }
            });

        } else {
            decksLikeInfix = await fetch(`${requestPath}/decks/${request}&page=${page}`, {
                method: 'GET'
            });
        }

        if (!decksLikeInfix.ok) {
 
            return;
        }

        const decksLikeInfixJson = await decksLikeInfix.json();
        setDecks(decksLikeInfixJson);
        let checkNextPage: any

        if (token != null) {

            checkNextPage = await fetch(`${requestPath}/decks/${request}&page=${page+1}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem("token")
                }
            });

        } else {
            checkNextPage = await fetch(`${requestPath}/decks/${request}&page=${page+1}`, {
                method: 'GET'
            });
        }

        if (!checkNextPage.ok) {
            setNextPage(false);
            return;
        }

        const nextPageJson = await checkNextPage.json();
        
        setNextPage(nextPageJson.length > 0);

    }

    const incrementPage = () => {
        setPage(page + 1);
    };

    const decrementPage = () => {
        setPage(page - 1);
    };

    const deckSearchResultHTML = () => {
        return (
        <div>
        <Typography variant="h3" sx = {{padding: 6, width: "100%", display: "flex", justifyContent: "center"}}>
            {page > 1?
            <IconButton aria-label="delete" onClick={decrementPage} sx = {{width: 48, height: 48, marginTop: 0}}>
                <NavigateBeforeIcon/>
            </IconButton> :
            <div style = {{width: 48}}></div>}
            Search results
            {nextPage ?
                <IconButton aria-label="delete" onClick={incrementPage} sx = {{width: 48, height: 48, marginTop: 0}}>
                    <NavigateNextIcon />
                </IconButton> :
                <div style = {{width: 48}}></div>
            }
        </Typography>
        <Decklist data={decks} updateMethod={null} mine={false}/>
        </div>)
    }

    return (
        deckSearchResultHTML()
    );
}

export default DeckSearchResult;