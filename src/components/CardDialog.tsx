import { Dialog } from "@mui/material";
import React, {useState, useEffect} from "react";
import { requestPath } from "../utils";

export interface DialogInterface {
    card: any,
    open: any,
    setOpen: any
}

const CardDialog = (props: DialogInterface) => {
    const [cardInfo, setCardInfo] = useState<any>({});

    const getCardInfo = async () => {
        console.log(props.card)
        const cardLikeId = await fetch(`${requestPath}/cards/?id=${props.card}`, {
            method: 'GET' // TODO - auth header if there is a token in localStorage
        });
        const cardLikeIdJson = await cardLikeId.json();
        console.log(cardLikeIdJson[0]);
        setCardInfo({...cardLikeIdJson[0]})
    }

    useEffect(() => {
        if (!props.open) {
            return;
        }

        getCardInfo();
        
    }, [props.open])

    return (
        <Dialog open = {props.open} onClose = {() => props.setOpen(false)}>
            {cardInfo.card_name}
        </Dialog>
    )
}

export default CardDialog;