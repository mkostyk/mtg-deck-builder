import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, TextField, Input, CssBaseline, Container, InputAdornment, IconButton, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { requestPath } from "../utils";
import NavBar from "./NavBar";
import { redirect } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Card_t } from "./CardSearchResult";

export function CardSearch() {
    const navigate = useNavigate();

    const handleSearchCards = async (event: any) => {
        event.preventDefault();

        const cardsLikeInfix = await fetch(`${requestPath}/cards/?name=${event.target.search.value}`, {
            method: 'GET' // TODO - auth header if there is a token in localStorage
        });

        if(!cardsLikeInfix.ok) {
            console.log("Error") // TODO
            return;
        }
        const cardsLikeInfixJson = await cardsLikeInfix.json();
        
        const cardData = await Promise.all(cardsLikeInfixJson.map(async (card: any) => {
            const requestImageURL = await fetch(`${requestPath}/images/?id=${card.id}`, {
                method: 'GET' // TODO - auth header if there is a token in localStorage
            })
            if (!requestImageURL.ok) {
                console.log("Error") // TODO
                return;
            }
            const imageURL = await requestImageURL.json();
            const gowno = {id: card.id, cardName: card.card_name, manaCost: card.mana_cost, cardtext: card.card_text, typeLine: card.type_line, imageURL: imageURL};
            console.log(gowno);
            return gowno;
        }))
        //todo - localstorage
        console.log(cardData);
    }

    function searchField() {
        return (
        <Box component="form" onSubmit={handleSearchCards} 
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', marginTop: 12}}>
            <Typography component="h1" variant="h5" sx={{ margin: '0.5rem' }}>
                Search for cards
            </Typography>

            <Grid container sx={{ alignItems: 'center' }}>
                <Grid item xs>
                    <TextField id="search-cards-input" name="search" label="Search" type="text" fullWidth sx={{ margin: '0.5rem' }}>
                        <Input defaultValue=""/>
                    </TextField>
                </Grid>

                <Grid item>
                    <IconButton type="submit" color='primary' sx={{ margin: '1rem' }}>
                            <SearchIcon />
                    </IconButton>
                </Grid>
            </Grid>           
        </Box>)
    }

    return searchField();
}