import Decklist from "./Decklist";

function DeckSearchResult() {
    const deckSearchResultHTML = () => {
        const decks = JSON.parse(localStorage.getItem("decks") || "null");
        return <Decklist data={decks} updateMethod={null}/>
    }

    return (
        deckSearchResultHTML()
    );
}

export default DeckSearchResult;