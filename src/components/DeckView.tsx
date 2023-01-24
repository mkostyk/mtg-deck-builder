import { useState } from "react";
import { useParams } from "react-router-dom";
import { isEmptyBindingElement } from "typescript";
import Cardlist from "./Cardlist";
import React, {useEffect} from "react";

import { requestPath } from "../utils";
import { Typography, Button, Paper, IconButton, Dialog } from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import CardDialog from "./CardDialog";
import { DialogInterface } from "./CardDialog";

function DeckView() {
    const id = useParams().id;
    const [cardList, setCardList] = useState<any[]>([]);

    useEffect(() => {
        getCardList()
    }, [])

    const getCardList = async () => {
        const response = await fetch(`${requestPath}/cardsInDeck/?deck_id=${id}`, {
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
            const gowno2 = {...cardLikeIdJson[0]};
            console.log(gowno2)
            return gowno2;
        }))

        console.log(cardDataFull);
        setCardList(cardDataFull);
    }

    const stringManaToArray = (manaString: []) => {
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

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogCard, setDialogCard] = useState(-1);

    const handleShowDetailButton = (cardId: any) => {
        setOpenDialog(true);
        setDialogCard(cardId);
    }

    return (
        <div>
            <CardDialog
                open = {openDialog}
                setOpen = {setOpenDialog}
                card = {dialogCard}
            />
            <div style = {{display: "flex", flexDirection: "column", justifyItems: "center", alignItems: "center"}}>
                <Typography variant="h3" sx = {{padding: 3}}>This is deck editing page</Typography>
                <Typography variant="h4">Deck id: {id}</Typography>
            </div>
            <div style = {{padding: 25}}>
                {cardList.map((card, key) => (
                    <Paper sx = {{padding: 3, margin: 5, borderRadius: 1000, fontSize: 20, backgroundColor: "lightgrey", display: "flex"}} key = {key}>
                        <IconButton sx = {{height: 32, width: 32, marginRight: 2}}>
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