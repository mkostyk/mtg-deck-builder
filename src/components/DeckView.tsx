import { useState } from "react";
import { useParams } from "react-router-dom";
import { isEmptyBindingElement } from "typescript";
import Cardlist from "./Cardlist";

function DeckView() {
    const id = useParams().id;
    const [cardList, setCardList] = useState([]);

    const getCardList = () => {
        fetch(`http://localhost:8000/cardsInDeck/?deck_id=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("token")
            }
        })
        .then((response) => {
            if (!response.ok) {
                // TODO - wrong token
                console.log("Error") // TODO
                return;
            }

            response.json().then((data) => {
                setCardList(data);
            });
        });
    }

    const cardListHTML = () => {
        if (cardList.length > 0) {
            return <Cardlist data={cardList}/>
        } else {
            return "This deck is empty"
        }
    }

    return (
        <div>
            <h1>This is deck editing page.</h1>
            <h2>Deck id: {id}</h2>
            <button onClick={getCardList}>Get card list</button>
            {cardListHTML()}
        </div>
    );
}

export default DeckView;