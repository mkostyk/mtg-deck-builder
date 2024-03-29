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
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';


export interface Card_t {
    id: number;
    cardName: string;
    manaCost: string;
    cardText: string;
    typeLine: string;
    imageURL: string;
}

const handleClickCard = async (id:number, nav: any) => {
    
    const cardRequest = await fetch(`${requestPath}/cards/?id=${id}`, {
        method: 'GET'
    });

    if(!cardRequest.ok) {
        return;
    }

    const cardJson = await cardRequest.json();

    localStorage.setItem("card", JSON.stringify(cardJson));
    nav('/cardView');

}

function CardSearchResult() {
    const navigate = useNavigate();
    const [cards, setCards] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [nextPage, setNextPage] = useState(false);

    const getDecks = async() => {
        const request = localStorage.getItem("request");
        const token = localStorage.getItem("token");

        let cardsRequest: any;

        if(token != null){
            cardsRequest = await fetch(`${requestPath}/cards/${request}&page=${page}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + token
                }
            });
        } else {
            cardsRequest = await fetch(`${requestPath}/cards/${request}&page=${page}`, {
                method: 'GET'
            });
        }

        if (!cardsRequest.ok) {
            return;
        }

        const cardsJson = await cardsRequest.json();

        const cardData = await Promise.all(cardsJson.map(async (card: any) => {
            const requestImageURL = await fetch(`${requestPath}/images/?id=${card.id}`, {
                method: 'GET' 
            })
            let imageURL: any;
            imageURL = null;

            if (!requestImageURL.ok) {
            } else {
                imageURL = await requestImageURL.json();
            }
            const cardData = {id: card.id, cardName: card.card_name, manaCost: card.mana_cost, cardtext: card.card_text, typeLine: card.type_line, imageURL: imageURL};
            return cardData;
        }))

        setCards(cardData);

        const checkNextPage = await fetch(`${requestPath}/cards/${request}&page=${page + 1}`, {
            method: 'GET'
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
    }, []);

    useEffect(()=>{
        getDecks();
    }, [page]);

    const incrementPage = () => {
        setPage(page + 1);
    }

    const decrementPage = () => {
        setPage(page - 1);
    }

    const searchResultHTML = () => {
        return (
            <div>
                <Typography variant = "h4" sx = {{paddingTop: 6, paddingBottom: 2, width: "100vw", display: "flex", justifyContent: "center"}}>
                {page > 1 ?
                <IconButton aria-label="delete" onClick={decrementPage} sx = {{width: 48, height: 48, marginTop: -1}}>
                    <NavigateBeforeIcon sx = {{fontSize: 32}}/>
                </IconButton> :
                <div style = {{width: 48}}></div>}
                    Search results
                    {nextPage ?
                    <IconButton aria-label="delete" onClick={incrementPage} sx = {{width: 48, height: 48, marginTop: -1}}>
                        <NavigateNextIcon sx = {{fontSize: 32}}/>
                    </IconButton> :
                    <div style = {{width: 48}}></div>
                    }
                </Typography>
                <div style = {{display: "flex", flexWrap: "wrap", padding: 20, width: "100vw", justifyContent: "center"}}>
                    {cards.map((card: any) => (
                        (card.imageURL != null? 
                        <img
                            src = {`${card.imageURL.normal}`}
                            crossOrigin = "anonymous"
                            style = {{height: 400, padding: 10}}
                            onClick = {() => handleClickCard(card.id, navigate)}
                        /> : <></>)
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