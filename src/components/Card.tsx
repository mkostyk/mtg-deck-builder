import { useState } from "react";

export interface Card_t {
    id: number;
}

function DeckView(props: Card_t) {
    const [card, setCard] = useState({id: 0, name: ""});
    const [showing, setShowing] = useState(false);

    const fetchCard = (id: number) => {
        fetch(`http://localhost:8000/cards/?id=${id}`, {
            method: 'GET',
        }).then((response) => {
            if (!response.ok) {
                console.log("Error") // TODO
                return {};
            }

            response.json().then((data) => {
                setCard({id: data[0].id, name: data[0].card_name});
                setShowing(true);
                console.log(card);
            });
        });
    }

    const cardHTML = () => {
        // We have to wait until card has fetched its info from API before we can display it.
        if (!showing) {
            fetchCard(props.id);
            return <h3></h3>
        } else {
            return <h3>This is {card.name}</h3>
        }
    }

    return (
        cardHTML()
    );
}

export default DeckView;