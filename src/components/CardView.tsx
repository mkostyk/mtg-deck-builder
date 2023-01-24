import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, TextField, Input, CssBaseline, Container, InputAdornment, IconButton, Grid, imageListClasses } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { requestPath } from "../utils";
import NavBar from "./NavBar";
import { ImageAspectRatio } from "@mui/icons-material";
import Stack from '@mui/material/Stack';
import Card from './Card';


function CardView() {
    const searchResultHTML = () => {
        const card = JSON.parse(localStorage.getItem("card") || "null")[0];
        console.log(card.id);
        return (
            <Box>
                <Grid container sx={{ alignItems: 'center' }}>
                    <Grid item xs>
                        <Card id={card.id} card_id={card.id}/>
                    </Grid>
                    <Grid item>
                        {card.cardName}
                    </Grid>
                    <Grid item>
                        {card.manaCost}
                    </Grid>
                    <Grid item>
                        {card.typeLine}
                    </Grid>
                    <Grid item>
                        {card.cardText}
                    </Grid>
                </Grid>         
            </Box>
            )
    }
    return (
        searchResultHTML()
    );
}

export default CardView;