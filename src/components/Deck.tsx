export interface Deck_t {
    id: number;
    name: string;
    private: boolean;
}

function Deck (props: Deck_t) {
    const deckHTML = (
        <div>
            <h2>Deck name: {props.name}</h2>
            <h3>Is private? {props.private.toString()}</h3>
        </div>
    )

    return (
        deckHTML
    );
}

export default Deck;