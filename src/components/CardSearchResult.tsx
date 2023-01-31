import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, TextField, Input, CssBaseline, Container, InputAdornment, IconButton, Grid, imageListClasses, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { requestPath } from "../utils";
import NavBar from "./NavBar";
import { ImageAspectRatio } from "@mui/icons-material";
import Stack from '@mui/material/Stack';
import { NumberLiteralType } from "typescript";


export interface Card_t {
    id: number;
    cardName: string;
    manaCost: string;
    cardText: string;
    typeLine: string;
    imageURL: string;
}

function handleClickCard(id:number, nav: any){
    return ((event: any) =>
    {
        console.log(id);
        
        fetch(`${requestPath}/cards/?id=${id}`, {
            method: 'GET' // TODO - auth header if there is a token in localStorage
        }).then((response) => {
            if (!response.ok) {
                console.log("Error") // TODO
                return;
            }

            response.json().then((data) => {
                console.log(JSON.stringify(data));
                localStorage.setItem("card", JSON.stringify(data));
                nav('/cardView');
            });
        });
    })
        
}

function SingleCardResult(props: Card_t) {
    const image = props.imageURL;
    const cardName = props.cardName;
    const typeLine = props.typeLine;
    const cardText = props.cardText;
    const manaCost = props.manaCost;
    const navigate = useNavigate();   
    console.log(props.id); 
    console.log(image);

    return ( <Box>
        <Button onClick={handleClickCard(props.id, navigate)}>
       <Grid container spacing={2}>
        <Grid item>
        <img src={`${image}`}/>
        </Grid>
        <Grid item>
        <Grid item>
            {cardName}
        </Grid>
        <Grid item>
            {manaCost}
        </Grid>
        <Grid item>
            {typeLine}
        </Grid>
        <Grid item>
            {cardText}
        </Grid>
        </Grid>
      </Grid>
      </Button>
    </Box>);
}

function CardSearchResult() {
    const searchResultHTML = () => {
        const cards = JSON.parse(localStorage.getItem("cards") || "null");
        console.log(cards);

        return (
            <Box>
                <Stack spacing={2}>
                    {cards.map((card: any) => (
                        <SingleCardResult id={card.id} cardName={card.cardName} manaCost={card.manaCost} cardText={card.cardText} typeLine={card.typeLine} imageURL={card.imageURL.small} />
                    ))}
                </Stack>
                
            </Box>
            )
    }
    return (
        searchResultHTML()
    );
}

export default CardSearchResult;