import { useState } from "react";
import { Paper } from "@mui/material";

export interface Card_t {
    id: number;
}

function DeckView(props: Card_t) {
    const [card, setCard] = useState({id: 0, name: ""});
    const [image, setImage] = useState("");
    const [loaded, setLoaded] = useState(false);

    const fetchImage = (id: number) => {
        fetch(`http://localhost:8000/images/?id=${id}`, {
            method: 'GET',
        }).then((response) => {
            if (!response.ok) {
                console.log("Error") // TODO
                return;
            }

            response.json().then((data) => {
                setImage(data.small);
                setLoaded(true);
            });
        });
    }

    const fetchCard = (id: number) => {
        fetch(`http://localhost:8000/cards/?id=${id}`, {
            method: 'GET',
        }).then((response) => {
            if (!response.ok) {
                console.log("Error") // TODO
                return;
            }

            response.json().then((data) => {
                setCard({id: data[0].id, name: data[0].card_name});
                fetchImage(data[0].id);
            });
        });
    }

    const cardHTML = () => {
        // We have to wait until card has fetched its info from API before we can display it.
        if (!loaded) {
            fetchCard(props.id);
            return <h3></h3>
        } else {
            return (
                <Paper variant="outlined">
                    <img src={image} />
                </Paper>)
        }
    }

    return (
        cardHTML()
    );
}

export default DeckView;