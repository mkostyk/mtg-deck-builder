import { Link, useNavigate } from "react-router-dom";
import React, { ChangeEvent, useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, TextField, Input, CssBaseline, Container, InputAdornment, IconButton, Grid, Autocomplete, Chip, Button, Icon } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { requestPath } from "../utils";
import NavBar from "./NavBar";
import { redirect } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Card_t } from "./CardSearchResult";
import { AnyMxRecord } from "dns";
import { useTheme } from "@emotion/react";

export function CardSearch() {
    const navigate = useNavigate();

    const parseColors = () => {
        let result: string;
        result = "";
        result += chosenColors.B ? "B" : "";
        result += chosenColors.G ? "G" : "";
        result += chosenColors.R ? "R" : "";
        result += chosenColors.U ? "U" : "";
        result += chosenColors.W ? "W" : "";
        return result;
    }

    const parseRequest = () => {
        let request: string;
        request = "?page=1";
        request += "&name=" + cardname;
        request += "&type=";
        chosenTypes.forEach((type) => {
            request += type + " ";
        })
        request += chosenSubtype;
        request += "&format_name=" + chosenFormat;
        request += "&color_identity=" + parseColors();
        console.log(request);
        return request;
    }

    // TODO - do przeróbki, bo bardziej skomplikowany request
    const handleSearchCards = async () => {
        //event.preventDefault();

        /*console.log(cardname);
        console.log(chosenFormat);
        console.log(chosenTypes);
        console.log(chosenColors);
        console.log(chosenSubtype);*/

        const request = parseRequest();

        const cardsLikeInfix = await fetch(`${requestPath}/cards/${request}`, {
            method: 'GET' // TODO - auth header if there is a token in localStorage
        });

        if(!cardsLikeInfix.ok) {
            console.log("Error tutaj") // TODO
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
        
        localStorage.setItem("cards", JSON.stringify(cardData));
        navigate("../cardSearchResult");
    }

    const cardTypeOptions = [
        {label: "Creature", id: 1},
        {label: "Artifact", id: 2},
        {label: "Sorcery", id: 3},
        {label: "Enchantment", id: 4},
    ]

    const [chosenTypes, setChosenTypes] = useState<string[]>([]);

    const deleteChosenType = (chosenType: any) => {
        setChosenTypes(prevChosenTypes => prevChosenTypes.filter(prevChosenType => prevChosenType !== chosenType))
    }

    const colors = ["B", "G", "R", "U", "W"];

    interface typescripttogowno {
        [index: string]: boolean,
        "B": boolean,
        "G": boolean,
        "R": boolean,
        "U": boolean,
        "W": boolean,
    }

    const [chosenColors, setChosenColors] = useState<typescripttogowno>({
        "B": false,
        "G": false,
        "R": false,
        "U": false,
        "W": false
    });

    const handleColorOnClick = (color: string) => {
        const isThere = chosenColors[color];

        setChosenColors(prevChosenColors => ({
            ...prevChosenColors,
            [color]: !isThere
        }))
    }

    const [chosenFormat, setChosenFormat] = useState("");

    const [chosenSubtype, setChosenSubtype] = useState("");

    const [cardname, setCardName] = useState("");

    function searchField() {
        return (
        <Box
            sx={{ display: 'flex', flexDirection: 'column', paddingLeft: 12, paddingRight: 12, /*alignItems: 'center',*/ height: '100vh'}}
        >
            <Typography component="h1" variant="h3" sx={{ padding: 6, paddingLeft: 0}}>
                Search for cards
            </Typography>
            <IconButton
                onClick = {handleSearchCards}
                sx = {{
                    margin: '1rem',
                    position: "fixed", right: 25, bottom: 25,
                    backgroundColor: "blue", color: "white",
                    transition: "background-color 0.15s linear",
                    "&:hover": {
                        backgroundColor: "lightblue"
                      }
                }}
            >
                <SearchIcon sx = {{fontSize: 60}}/>
            </IconButton>
            <div style = {{display: "flex", width: "100%"}}>
                <div style = {{width: "100%", marginRight: 30}}>
                    <div style={{paddingBottom: 40}}>
                        <Typography variant = "h5" sx = {{marginBottom: 2}}>
                            Card name
                        </Typography>
                        <div style = {{display: "flex"}}>
                            <TextField
                                label="Search by card name"
                                type="text"
                                fullWidth sx={{ marginTop: '0.5rem' }}
                                value = {cardname}
                                onChange = {(event: ChangeEvent<HTMLInputElement>) => setCardName(event.target.value)}
                            >
                                <Input defaultValue=""/>
                            </TextField>
                        </div>
                    </div>
                    <div style={{paddingBottom: 40}}>
                        <Typography variant = "h5" sx = {{marginBottom: 2}}>
                            Format
                        </Typography>
                        <div style = {{display: "flex"}}>
                            <Autocomplete
                                options={[{label: "Commander", id: 1}, {label: "Modern", id: 2}]}
                                renderInput={(params) => <TextField {...params} label = "Search a format"/>}
                                sx = {{width: "100%"}}
                                onChange = {(event, newFormat) => {
                                    if (newFormat) {
                                        setChosenFormat(newFormat.label)
                                    }
                                    else {
                                        setChosenFormat("");
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div style={{paddingBottom: 40}}>
                        <Typography variant = "h5" sx = {{marginBottom: 2}}>
                            Card type
                        </Typography>
                        <div style = {{display: "flex"}}>
                            <Autocomplete
                                options= {cardTypeOptions.filter(cardTypeOption => !chosenTypes.some(chosenType => cardTypeOption.label === chosenType))}
                                renderInput={(params) => <TextField {...params} label = "Search a format"/>}
                                onChange = {(event, newInputValue) => {
                                    if (newInputValue) {
                                        setChosenTypes(prevChosenTypes => [...prevChosenTypes, newInputValue.label])
                                    }
                                }}
                                sx = {{width: "100%"}}
                            />
                        </div>
                        <div style = {{paddingTop: 20}}>
                            {chosenTypes.map((chosenType, key) =>
                                <Chip
                                    key = {key}
                                    label = {<div style = {{paddingRight: 5}}>{chosenType}</div>}
                                    sx = {{fontSize: 20, paddingTop: 3, paddingBottom: 3, borderRadius: 100, marginRight: 1}}
                                    onDelete = {() => deleteChosenType(chosenType)}
                                />    
                            )}
                        </div>
                    </div>
                </div>
                <div style = {{width: "100%", marginLeft: 30}}>
                    <div style={{paddingBottom: 40}}>
                        <Typography variant = "h5" sx = {{marginBottom: 2}}>
                            Color
                        </Typography>
                        <div style = {{paddingTop: 20, display: "flex"}}>
                            {colors.map((color, key) =>
                                <div style = {{width: "100%", display: "flex", justifyContent: "center"}}>
                                    <img
                                        key = {key}
                                        alt = "manaElem"
                                        src = {require(`../icons/${color}.png`)}
                                        style = {{
                                            width: 100,
                                            border: (chosenColors[color]) ? "4px solid black" : "4px solid rgba(255, 0, 0, 0)",
                                            borderRadius: 100,
                                            transition: "border 0.15s linear"
                                        }}
                                        onClick = {() => handleColorOnClick(color)}
                                    />
                                </div> 
                            )}
                        </div>
                    </div>
                    <div style = {{paddingBottom: 40, marginTop: 88}}>
                        <Typography variant = "h5" sx = {{marginBottom: 2}}>
                            Subtype
                        </Typography>
                        <div style = {{display: "flex"}}>
                            <Autocomplete
                                options={[{label: "Centaur", id: 1}, {label: "Druid", id: 2}]}
                                renderInput={(params) => <TextField {...params} label = "Search a format"/>}
                                sx = {{width: "100%"}}
                                onChange = {(event, newSubtype) => {
                                    if (newSubtype) {
                                        setChosenSubtype(newSubtype.label)
                                    }
                                    else {
                                        setChosenSubtype("");
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Box>)
    }

    return searchField();
}