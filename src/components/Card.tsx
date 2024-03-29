import { useState } from "react";
import { Paper } from "@mui/material";
import { requestPath } from "../utils";

export interface Card_t {
    id: number;
    card_id: number;
}

function DeckView(props: Card_t) {
    const [card, setCard] = useState({id: 0, name: ""});
    const [image, setImage] = useState("");
    const [loaded, setLoaded] = useState(false);

    const fetchImage =  async(id: number) => {
        const imageRequest = await fetch(`${requestPath}/images/?id=${id}`, {
            method: 'GET',
        });
        
        if(!imageRequest.ok) {
            return;
        }

        const imageJson = await imageRequest.json();

        setImage(imageJson.small);
        setLoaded(true);

    }

    const fetchCard = async (id: number) => {
        const cardRequest = await fetch(`${requestPath}/cards/?id=${id}`, {
            method: 'GET',
        });

        if(!cardRequest.ok) {
            return;
        }

        const cardJson = (await cardRequest.json())[0];

        setCard({id: cardJson.id, name: cardJson.card_name});
        fetchImage(cardJson.id);
    }

    const cardHTML = () => {
        // We have to wait until card has fetched its info from API before we can display it.
        if (!loaded) {
            fetchCard(props.card_id);
            return <h3></h3>
        } else {
            return (
                <Paper variant="outlined">
                    <img src={image} crossOrigin="anonymous"/>
                </Paper>)
        }
    }

    return (
        cardHTML()
    );
}

export default DeckView;