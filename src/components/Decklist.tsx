
import { Grid } from '@mui/material';
import PublicDeck from './PublicDeck';

export interface Deck_t {
    id: number;
    name: string;
    private: boolean;
    updateMethod: any;
    author: string;
    last_update: string;
}

export interface Decklist_t {
    data: Array<Deck_t>;
    updateMethod: any;
    mine: boolean;
}



function Decklist (props: Decklist_t) {
    const deckListHTML = (
        <Grid container sx={{ alignItems: 'center', padding: 3, paddingTop: 0}} spacing={3} >
            {props.data.map((deck: Deck_t) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={deck.id}>
                    <PublicDeck
                        key={deck.id}
                        id={deck.id}
                        name={deck.name}
                        private={deck.private}
                        updateMethod={props.updateMethod}
                        mine={props.mine}
                        author={deck.author}
                        last_update={deck.last_update}
                    />
                </Grid>
            ))}   
        </Grid>
    )

    return (
        deckListHTML
    );
}

export default Decklist;