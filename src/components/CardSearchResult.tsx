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

function handleClickCard(id:number, nav: any) {
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
}

function CardSearchResult() {
    const navigate = useNavigate();

    const searchResultHTML = () => {
        const cards = JSON.parse(localStorage.getItem("cards") as string);
        console.log(cards);

        return (
            <div>
                <Typography variant = "h4" sx = {{paddingTop: 6, paddingBottom: 2, width: "100vw", display: "flex", justifyContent: "center"}}>
                    Search results
                </Typography>
                <div style = {{display: "flex", flexWrap: "wrap", padding: 20, width: "100vw", justifyContent: "center"}}>
                    {cards.map((card: any) => (
                        <img
                            src = {`${card.imageURL.normal}`}
                            style = {{height: 400, padding: 10}}
                            onClick = {() => handleClickCard(card.id, navigate)}
                        />
                    ))}
                </div>
            </div>
        )
    }
    return (
        searchResultHTML()
    );
}

export default CardSearchResult;