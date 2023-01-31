import { useState } from "react";
import { useParams } from "react-router-dom";
import { isEmptyBindingElement } from "typescript";
import Cardlist from "./Cardlist";
import React, {useEffect} from "react";

import { requestPath } from "../utils";
import { Typography, Button, Paper, IconButton, Dialog, Autocomplete, TextField } from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import CardDialog from "./CardDialog";
import { DialogInterface } from "./CardDialog";
import cardNames from "../assets/card_names-1.json"

function DeckView() {
    const deckId = useParams().id;
    const [cardList, setCardList] = useState<any[]>([]);
    const [cardListWithCount, setCardListWithCount] = useState<any[]>([]);

    useEffect(() => {
        getCardList()
    }, [])

    const getCardList = async () => {
        const response = await fetch(`${requestPath}/cardsInDeck/?deck_id=${deckId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        });

        if (!response.ok) {
            // TODO - wrong token
            console.log("Error") // TODO
            return;
        }

        const responseJson = await response.json();
        console.log(responseJson)
        
        const cardDataFull : any[] = await Promise.all(responseJson.map(async (card: any) => {
            console.log(card);
            const cardLikeId = await fetch(`${requestPath}/cards/?id=${card.card_id}`, {
                method: 'GET' // TODO - auth header if there is a token in localStorage
            });
            const cardLikeIdJson = await cardLikeId.json();
            console.log(cardLikeIdJson);
            const gowno2 = {...cardLikeIdJson[0], deleteId: card.id};
            console.log(gowno2)
            return gowno2;
        }))

        console.log(cardDataFull);
        setCardList(cardDataFull);

        compressWithCount(cardDataFull)
    }

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

        return res;
    }

    const compressWithCount = (cards: any) => {
        const cardListIds = cards.map((card: any) => (card.id));
        console.log(cardListIds)
        const cardListIdsNoDuplicates = cardListIds.filter((cardId: any, index: any) => {
            return cardListIds.indexOf(cardId) === index
        });

        console.log(cardListIdsNoDuplicates)

        const cardListWithCount = cardListIdsNoDuplicates.map((cardId: any) => (
            {
                ...cards.find((card: any) => card.id === cardId),
                count: cards.filter((origCard: any) => origCard.id === cardId).length
            }
        ))

        console.log(cardListWithCount)
        setCardListWithCount(cardListWithCount)
    }

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogCard, setDialogCard] = useState(-1);

    const handleShowDetailButton = (cardId: any) => {
        setOpenDialog(true);
        setDialogCard(cardId);
    }

    const [autocompleteInputValue, setAutocompleteInputValue] = useState("");

    const handleAutocompleteValueChange = async (newValue: any) => {
        console.log(newValue)

        if (newValue) {
            console.log("hej")
            const res = await fetch(`${requestPath}/cardsInDeck/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    deck_id: deckId,
                    card_id: newValue.id
                })
            })

            console.log(await res.json())
            getCardList();
        }
    }

    const handleDeleteCard = async (card: any) => {
        console.log(card)
        await fetch(`${requestPath}/cardsInDeck/?id=${card.deleteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("token"),
            }     
        })

        getCardList()
    }

    return (
        <div>
            <CardDialog
                open = {openDialog}
                setOpen = {setOpenDialog}
                card = {dialogCard}
            />
            <div style = {{display: "flex", flexDirection: "column", justifyItems: "center", alignItems: "center"}}>
                <Typography variant="h3" sx = {{padding: 5}}>Edit this deck!</Typography>
                {/*<Typography variant="h4">Deck id: {id}</Typography>*/}
            </div>
            <Autocomplete
                sx = {{paddingLeft: 10, paddingRight: 10}}
                renderInput={(params) => <TextField {...params} label = "Search for new cards" /*inputProps = {{style: {fontSize: 20}}}*/ InputLabelProps = {{style: {fontSize: 20}}}/>}
                options = {
                    cardNames.filter(card => card.name.includes(autocompleteInputValue))
                             .map(card => ({label: card.name, id: card.id})).slice(0, 10)}
                onInputChange = {(event, newInputValue) => {
                    setAutocompleteInputValue(newInputValue)
                }}
                onChange = {(event, newValue) => handleAutocompleteValueChange(newValue)}
            />
            <div style = {{padding: 25}}>
                {cardListWithCount.map((card, key) => (
                    <Paper
                        sx = {{padding: 3, margin: 5, borderRadius: 1000, fontSize: 20, backgroundColor: "lightgrey", display: "flex"}}
                        key = {key}
                    >
                        <IconButton
                            sx = {{height: 32, width: 32, marginRight: 2}}
                            onClick = {() => handleDeleteCard(card)}
                        >
                            <ClearIcon/>
                        </IconButton>
                        <div style = {{display: "flex", flexGrow: 1}}>
                            <div style = {{minWidth: 275}}>
                                {card.card_name}
                            </div>
                            <div style = {{marginLeft: 25}}>
                                {(stringManaToArray(card.mana_cost).cost === '')
                                ? ''
                                : <img
                                    alt = "manaCost"
                                    src = {require(`../icons/${stringManaToArray(card.mana_cost).cost}.png`)} style = {{width: 24}}
                                    />
                                }
                                {stringManaToArray(card.mana_cost).mana.map((manaElem, key) => (
                                    <img
                                        key = {key}
                                        alt = "manaElem"
                                        src = {require(`../icons/${manaElem}.png`)} style = {{width: 24}}
                                    />
                                ))}
                            </div>
                        </div>
                        <IconButton sx = {{width: 32, height: 32, marginRight: 2}}>
                            {card.count}
                        </IconButton>      
                        <Button variant = "contained" onClick = {() => handleShowDetailButton(card.id)}>
                            Click for details
                        </Button>
                    </Paper>
                ))}
            </div>
        </div>
    );
}

export default DeckView;