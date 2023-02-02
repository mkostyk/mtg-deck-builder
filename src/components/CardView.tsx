import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, TextField, Input, CssBaseline, Container, InputAdornment, IconButton, Grid, imageListClasses } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { requestPath } from "../utils";
import NavBar from "./NavBar";
import { ImageAspectRatio } from "@mui/icons-material";
import Stack from '@mui/material/Stack';

const classes = {
    leftGridItem: {
        fontSize: 20,
        minHeight: 40,
        display: "flex",
        alignItems: "center",
        fontWeight: 600
    },

    rightGridItem: {
        fontSize: 20,
    }
};


function CardView() {
    const [image, setImage] = useState("");
    const [card, setCard] = useState<any>();
    const [manaObj, setManaString] = useState<any>();

    //todo - można wyeksportować do jakichś utilsów
    const stringManaToArray = (manaString: []) => {
        console.log(manaString)
        let res = {cost: "", mana: []};
        for (let i = 0; i < manaString.length; ++i) {
            if (manaString[i] !== '{' && manaString[i] !== '}') {
                if ('0' <= manaString[i] && manaString[i] <= '9') {
                    res.cost += manaString[i];
                }
                else {
                    res.mana = [...res.mana, manaString[i]];
                }
            }
        }
        console.log(res)
        return res;
    }

    const fetchCardData = () => {
        const cardFromLocalStorage = JSON.parse(localStorage.getItem("card") || "null")[0];
        console.log(cardFromLocalStorage);
        setCard(cardFromLocalStorage);
        console.log("xddd")
        setManaString(stringManaToArray(cardFromLocalStorage.mana_cost))
        console.log("xd")

        fetch(`${requestPath}/images/?id=${cardFromLocalStorage.id}`, {
            method: 'GET',
        }).then((response) => {
            if (!response.ok) {
                console.log("Error") // TODO
                return;
            }

            response.json().then((data) => {
                setImage(data.normal);
            });
        });
    }

    useEffect(() => {
        console.log("gowno")
        fetchCardData();
    }, [])

    const left = 3;

    return (
        <div style = {{padding: 20, display: "flex"}}>
            <img src = {image} alt = "card image"/>
            <div>
                <div style = {{paddingLeft: 40, width: "100%"}}>
                    <Typography
                        variant = "h4"
                        sx = {{padding: 4, paddingLeft: 0, width: "100%", display: "flex", /*justifyContent: "center"*/}}
                    >
                        Card summary
                    </Typography>
                    <Grid container>
                        <Grid item xs = {left} sx = {classes.leftGridItem}>
                            Name
                        </Grid>
                        <Grid item xs = {12 - left} sx = {classes.rightGridItem}>
                            {(card) ? (card.card_name) : "card name"}
                        </Grid>
                        <Grid item xs = {left} sx = {classes.leftGridItem}>
                            Mana cost
                        </Grid>
                        <Grid item xs = {12 - left} sx = {classes.rightGridItem}>
                        {!manaObj ? "gowno" :
                        (manaObj.cost === '')
                            ? ''
                            : <img
                                alt = "manaCost"
                                src = {require(`../icons/${manaObj.cost}.png`)} style = {{width: 24, margin: 2}}
                                />
                        }
                        {!manaObj ? "gowno" :
                        manaObj.mana.map((manaElem: any, key: any) => (
                            <img
                                key = {key}
                                alt = "manaElem"
                                src = {require(`../icons/${manaElem}.png`)} style = {{width: 24, margin: 2}}
                            />
                        ))}
                        </Grid>
                        <Grid item xs = {left} sx = {classes.leftGridItem}>
                            Type line
                        </Grid>
                        <Grid item xs = {12 - left} sx = {classes.rightGridItem}>
                            {(card) ? (card.type_line) : "card type line"}
                        </Grid>
                        <Grid item xs = {left} sx = {classes.leftGridItem}>
                            Power/toughness
                        </Grid>
                        <Grid item xs = {12 - left} sx = {classes.rightGridItem}>
                            {(card) ? `${card.power}/${card.toughness}` : "card stats"}
                        </Grid>
                        <Grid item xs = {left} sx = {classes.leftGridItem}>
                            Text
                        </Grid>
                        <Grid item xs = {12 - left} sx = {classes.rightGridItem}>
                            {(card) ? (card.card_text) : "card text"}
                        </Grid>
                        <Grid item xs = {left} sx = {classes.leftGridItem}>
                            Flavor text
                        </Grid>
                        <Grid item xs = {12 - left} sx = {[classes.rightGridItem, {fontStyle: "italic"}]}>
                            {(card) ? (card.flavor_text) : "card flavor text"}
                        </Grid>
                    </Grid>
                </div>
                <div style = {{display: "flex"}}>
                    <div style = {{width: "100%", backgroundColor: "red", margin: 40}}>
                        jakaś tabelka na koszty
                    </div>
                    <div style = {{width: "100%", backgroundColor: "blue", margin: 40}}>
                        jakaś tabelka na dostępność
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardView;