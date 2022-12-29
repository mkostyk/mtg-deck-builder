import Decklist from "./Decklist";

function SearchResult() {
    const searchResultHTML = () => {
        const decks = JSON.parse(localStorage.getItem("decks") || "null");
        return <Decklist data={decks} updateMethod={null}/>
    }

    return (
        searchResultHTML()
    );
}

export default SearchResult;