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
    console.log(id);
    
    const cardRequest = await fetch(`${requestPath}/cards/?id=${id}`, {
        method: 'GET'
    });

    if(!cardRequest.ok) {
        return;
    }

    const cardJson = cardRequest.json();

    console.log(JSON.stringify(cardJson));
    localStorage.setItem("card", JSON.stringify(cardJson));
    nav('/cardView');


    /*fetch(`${requestPath}/cards/?id=${id}`, {
        method: 'GET'
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
    });*/
}

function CardSearchResult() {
    const navigate = useNavigate();
    const [cards, setCards] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [nextPage, setNextPage] = useState(false);

    const getDecks = async() => {
        const request = localStorage.getItem("request");
        console.log(request);

        const cardsRequest = await fetch(`${requestPath}/cards/${request}&page=${page}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        });

        if (!cardsRequest.ok) {
            console.log("Error") //TODO
            return;
        }

        const cardsJson = await cardsRequest.json();

        const cardData = await Promise.all(cardsJson.map(async (card: any) => {
            const requestImageURL = await fetch(`${requestPath}/images/?id=${card.id}`, {
                method: 'GET' // TODO - auth header if there is a token in localStorage
            })
            if (!requestImageURL.ok) {
                console.log("Error") // TODO
                return;
            }
            const imageURL = await requestImageURL.json();
            const cardData = {id: card.id, cardName: card.card_name, manaCost: card.mana_cost, cardtext: card.card_text, typeLine: card.type_line, imageURL: imageURL};
            console.log(cardData);
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
        console.log(localStorage.getItem("token"));
    }, []);

    useEffect(()=>{
        getDecks();
        console.log(localStorage.getItem("token"));
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
        )
    }
    return (
        searchResultHTML()
    );
}

export default CardSearchResult;