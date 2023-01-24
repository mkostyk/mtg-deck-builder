import Deck, { Deck_t } from './Deck';
import { Grid } from '@mui/material';
import PublicDeck from './PublicDeck';

export interface Decklist_t {
    data: Array<Deck_t>;
    updateMethod: any;
}

function Decklist (props: Decklist_t) {
    const deckListHTML = (
        <Grid container sx={{ alignItems: 'center', marginTop: 2 }} spacing={3} >
            {props.data.map((deck: Deck_t) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={deck.id}>
                    <PublicDeck key={deck.id} id={deck.id} name={deck.name} private={deck.private} updateMethod={props.updateMethod} />
                </Grid>
            ))}   
        </Grid>
    )

    return (
        deckListHTML
    );
}

export default Decklist;