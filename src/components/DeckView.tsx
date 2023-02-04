import { useState } from "react";
import { useParams } from "react-router-dom";
import { isEmptyBindingElement } from "typescript";
import Cardlist from "./Cardlist";
import React, {useEffect, useContext} from "react";

import { requestPath } from "../utils";
import { Typography, Button, Paper, IconButton, Dialog, Autocomplete, TextField } from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import CardDialog from "./CardDialog";
import { DialogInterface } from "./CardDialog";
import cardNames from "../assets/card_names-1.json"
import { LoginContext } from './LoginContext';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export interface Deck_t {
    id: number;
    author: number;
    name: string;
    user: string;
    format: string;
}

function DeckView() {
    const deckId = useParams().id;
    const [cardList, setCardList] = useState<any[]>([]);
    const [cardListWithCount, setCardListWithCount] = useState<any[]>([]);
    const { login } = useContext(LoginContext);
    const [isMine, setIsMine] = useState<boolean>(false);
    const [deck, setDeck] = useState<Deck_t>({id:-1, author:-1, name:"", user:"", format:""});
    const [privacy, setPrivacy] = useState<boolean>(false);
    const [privacySwitch, setPrivacySwitch] = useState(<></>);
    const [format, setFormat] = useState("");

    useEffect(() => {
        getDeck();
    }, [login])

    const handleChangeFormat = async (event: SelectChangeEvent) => {

        const newFormat = event.target.value as string
        console.log(newFormat);

        const token = localStorage.getItem("token");
        const response = await fetch(`${requestPath}/changeFormat/?deck_id=${deckId}&format_name=${newFormat}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        });

        if (!response.ok) {
            console.log("Error");
            return;
        }

        setFormat(newFormat);
    };

    const selectField = (<Box sx={{ minWidth: 120,  marginLeft: 10, marginRight: 10, marginBottom: 5 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Format</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={format}
            label="Format"
            onChange={handleChangeFormat}
          >
            <MenuItem value={"Standard"}>Standard</MenuItem>
            <MenuItem value={"Pioneer"}>Pioneer</MenuItem>
            <MenuItem value={"Modern"}>Modern</MenuItem>
            <MenuItem value={"Legacy"}>Legacy</MenuItem>
            <MenuItem value={"Vintage"}>Vintage</MenuItem>
            <MenuItem value={"Commander"}>Commander</MenuItem>
          </Select>
        </FormControl>
      </Box>)

    const getDeck = async () => {
        const token = localStorage.getItem("token");
        let deckRequest: any;
        
        console.log(token);

        if(token != null) {
            deckRequest = await fetch(`${requestPath}/decks/?id=${deckId}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem("token")
                }
            });
        } else {
            deckRequest = await fetch(`${requestPath}/decks/?id=${deckId}`, {
                method: 'GET'
            });
        }

        if(!deckRequest.ok){
            console.log("Skucha");
            setDeck({id: -1, author: -1, name: "", user:"", format:""});
            return;
        }

        const deckRequestJson = (await deckRequest.json())[0];

        console.log(deckRequestJson);

        const authorRequest = await fetch(`${requestPath}/users/?user_id=${deckRequestJson.author}`, {
            method: 'GET',
        })

        if(!authorRequest.ok) {
            return;
        }

        const authorJson = await authorRequest.json();

        console.log(authorJson);

        setDeck({id: deckRequestJson.id, author: deckRequestJson.author, name: deckRequestJson.name, user: authorJson.username, format: deckRequestJson.format});
        setPrivacy(deckRequestJson.private);
        setPrivacySwitch(privacy ?
            <FormControlLabel control={<Switch defaultChecked onChange={changePrivacy}/>} label="Private" /> :
            <FormControlLabel control={<Switch onChange={changePrivacy}/>} label="Private" />);
        setFormat(deckRequestJson.format);
        checkIfMine(deckRequestJson.author);
    }

    const checkIfMine =  async (author: any) => {
        const myId = await fetch(`${requestPath}/token/?token=${localStorage.getItem("token")}`, {
            method: 'GET'
        });

        if (!myId.ok) {
            setIsMine(false);
        }

        const myIdJson = await myId.json();

        console.log(myIdJson.user_id);
        console.log(author);

        setIsMine(myIdJson.user_id == author);
    }

    const changePrivacy = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${requestPath}/changePrivacy/?deck_id=${deckId}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        });

        if (!response.ok) {
            console.log("Error");
            return;
        }

        setPrivacy(!privacy);
    }

    useEffect(() => {
        getCardList();
    }, [])

    const getCardList = async () => {
        const token = localStorage.getItem("token");
        let response: any;
        
        console.log(token);

        if(token != null) {
            response = await fetch(`${requestPath}/cardsInDeck/?deck_id=${deckId}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem("token")
                }
            });
        } else {
            response = await fetch(`${requestPath}/cardsInDeck/?deck_id=${deckId}`, {
                method: 'GET'
            });
        }

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
            const obj = {...cardLikeIdJson[0], deleteId: card.id};
            console.log(obj)
            return obj;
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
    
    const deckView = () => {
        if(deck.id != -1) {
        return (
            <div>
                <CardDialog
                    open = {openDialog}
                    setOpen = {setOpenDialog}
                    card = {dialogCard}
                />
                <div style = {{display: "flex", flexDirection: "column", justifyItems: "center", alignItems: "center"}}>
                    <Typography variant="h3" sx = {{padding: 5, paddingBottom: 0}}>{isMine ? "Edit this deck!" : "Deck View"}</Typography>
                    <Typography variant="h5" sx = {{padding: 2}}>{deck.name} by {deck.user}</Typography>
                </div>
                    {isMine?
                        (
                        <div style = {{padding: 20, paddingLeft: 80}}>    
                            {privacySwitch}
                        </div>
                        ) :
                        <></>
                    }
                    {isMine?
                        selectField :
                        <Typography variant="h5" sx = {{padding: 5}}>Format: {deck.format}</Typography>
                    }
                { isMine ? 
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
                /> : <></>}
                <div style = {{padding: 25}}>
                    {cardListWithCount.map((card, key) => (
                        <Paper
                            sx = {{padding: 3, margin: 3, borderRadius: 1000, fontSize: 20, backgroundColor: "lightgrey", display: "flex"}}
                            key = {key}
                        >
                            {isMine ? <IconButton
                                sx = {{height: 32, width: 32, marginRight: 2}}
                                onClick = {() => handleDeleteCard(card)}
                            >
                                <ClearIcon/>
                            </IconButton> : <></>}
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
        );} else {
            return <Typography variant="h3" sx = {{padding: 6, width: "100%", display: "flex", justifyContent: "center"}}>
            Sorry, this deck is unavaible
        </Typography>;
        }
    }

    return deckView();
}

export default DeckView;