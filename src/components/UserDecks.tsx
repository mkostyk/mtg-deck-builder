import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, TextField, Input, CssBaseline, Container, InputAdornment, IconButton, Grid, imageListClasses, Button } from '@mui/material';
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



export function UserDecks() {
    const [decks, setDecks] = useState([]);
    const [page, setPage] = useState(1);
    const [nextPage, setNextPage] = useState(false);
    const { login } = useContext(LoginContext)

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


    if(login) {
    return (<div>
            <Typography variant="h3" sx = {{padding: 6, width: "100%", display: "flex", justifyContent: "center"}}>
                Your decks
            </Typography>
            <Decklist data={decks} updateMethod={null} mine={true}/>
            {page > 1?
            <IconButton aria-label="delete" onClick={decrementPage}>
                <NavigateBeforeIcon/>
            </IconButton> :
            <>
            </>}
            {nextPage ?
            <IconButton aria-label="delete" onClick={incrementPage}>
                <NavigateNextIcon />
            </IconButton> :
            <></>
            }
    </div>
    )} else {
        return <Typography variant="h3" sx = {{padding: 6, width: "100%", display: "flex", justifyContent: "center"}}>
        Log in to view your decks
    </Typography>
    }


}