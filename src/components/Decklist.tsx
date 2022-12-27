import Deck, { Deck_t } from './Deck';

export interface Decklist_t {
    data: Array<Deck_t>;
}

function Decklist (props: Decklist_t) {
    const deckListHTML = (
        <div>
            <h2>Decklist</h2>
            {props.data.map((deck) => (
                <Deck key={deck.id} id={deck.id} name={deck.name} private={deck.private} />
            ))}
        </div>
    )

    return (
        deckListHTML
    );
}

export default Decklist;