import { Dialog, DialogContent, DialogTitle, Typography, Button } from "@mui/material";
import React, {useState, useEffect} from "react";
import { requestPath } from "../utils";
import { useNavigate } from 'react-router-dom';

export interface DialogInterface {
    card: any,
    open: any,
    setOpen: any
}

const CardDialog = (props: DialogInterface) => {
    const [cardInfo, setCardInfo] = useState<any>({});
    const [cardPrices, setCardPrices] = useState<any>({});
    const [cardImages, setCardImages] = useState<any>({});
    const navigate = useNavigate();

    const getCardInfo = async () => {
        const cardLikeId = await fetch(`${requestPath}/cards/?id=${props.card}`, {
            method: 'GET' 
        });
        const cardLikeIdJson = await cardLikeId.json();
        setCardInfo(cardLikeIdJson);
    }

    const getCardPrices = async () => {
        const cardPrices = await fetch(`${requestPath}/prices/?id=${props.card}`, {
            method: 'GET' 
        });

        const cardPricesJson = await cardPrices.json();
        setCardPrices({...cardPricesJson[0]});
    }

    const getCardImages = async () => {
        const cardImages = await fetch(`${requestPath}/images/?id=${props.card}`, {
            method: 'GET' 
        });

        const cardImagesJson = await cardImages.json();
        setCardImages({...cardImagesJson});

    }

    const handleClick = async () => {
        localStorage.setItem("card", JSON.stringify(cardInfo));
        navigate("/cardView");
    }

    useEffect(() => {
        if (!props.open) {
            return;
        }

        getCardInfo();
        getCardPrices();
        getCardImages();
        
    }, [props.open])

    return (
        <Dialog open = {props.open} onClose = {() => props.setOpen(false)} PaperProps = {{style: {borderRadius: 20}}}>
            {/*<DialogTitle sx = {{fontSize: 24, fontWeight: 600}}>
                {cardInfo.card_name}
    </DialogTitle>*/}
            <DialogContent>
                <div style = {{}}>
                    <img src={`${cardImages.normal}`} style = {{width: 300}}/>
                    
                    <div>
                        <Typography variant = "h6" sx = {{display: "flex", justifyContent: "center", padding: 2}}>
                            Prices
                        </Typography>
                        <div style = {{display: "flex", width: "100%", flexGrow: 1, justifyContent: "center"}}>
                            <Typography variant = "h5" color = "blue" sx = {{display: "flex", width: "100%", flexGrow: 1, justifyContent: "center"}}>{cardPrices.eur} €</Typography>
                            <Typography variant = "h5" color = "red" sx = {{display: "flex", width: "100%", flexGrow: 1, justifyContent: "center"}}>{cardPrices.tix} tix</Typography>
                        </div>
                    </div>
                    <div style = {{display: "flex", justifyContent: "right", paddingTop: 20}}>
                        <Button variant = "contained" onClick={handleClick}>
                            Click to know more!
                        </Button>
                    </div>
                    
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CardDialog;