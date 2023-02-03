import Decklist from "./Decklist";

function DeckSearchResult() {
    const deckSearchResultHTML = () => {
        const decks = JSON.parse(localStorage.getItem("decks") || "null");
        return <Decklist data={decks} updateMethod={null} mine={false}/>
    }

    return (
        deckSearchResultHTML()
    );
}

export default DeckSearchResult;