import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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



export function UserDecks() {
    const [decks, setDecks] = useState([]);

    const getDecks = async() => {
        const decksLikeInfix = await fetch(`${requestPath}/decks/?user_id=${-1}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        });

        if (!decksLikeInfix.ok) {
            console.log("Error") //TODO
            return;
        }

        const decksLikeInfixJson = await decksLikeInfix.json();

        setDecks(decksLikeInfixJson);
    }

    useEffect(()=>{
        getDecks();
        console.log(localStorage.getItem("token"));
    }, []);

    return <Decklist data={decks} updateMethod={null} mine={true}/>

}