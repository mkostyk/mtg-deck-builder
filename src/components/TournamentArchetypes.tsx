import Deck, { Deck_t } from './Deck';
import PublicDeck from './PublicDeck';

import { Grid, IconButton, Typography, Menu, MenuItem, ListItemIcon, ListItemText,
    Paper, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import { MoreVert, Edit, Delete, Public, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { requestPath } from "../utils";

interface Archetype_t {
    id: number;
    name: string;
    popularity: string;
    example_deck_id: number;
    format: string;
}


function TournamentArchetypes() {
    const navigate = useNavigate();
    const [archetypes, setArchetypes] = useState<any[]>([]);

    const fetchArchetypes = async () => {
        const archetypesRequest = await fetch(`${requestPath}/tournamentArchetypes/?page=1&archetype=Aggro`, {
            method: 'GET'
        });

        if(!archetypesRequest.ok) {
            console.log("Error");
            return;
        }

        const archetypesJson = await archetypesRequest.json();

        const fetchedArchetypes = await Promise.all(archetypesJson.map(async (archetype:any) => {
            const deckRequest = await fetch(`${requestPath}/tournamentDecks/?page=1&deck_id=${archetype.example_deck_id}`, {
                method: 'GET'
            });
    
            if(!deckRequest.ok) {
                console.log("Error");
            }
    
            const deckJson = (await deckRequest.json())[0];
            console.log(deckJson);

            return {id: archetype.id, name: archetype.name, popularity: archetype.popularity, example_deck_id: deckJson.deck_id, format: deckJson.tournament_format};
        }));

        console.log(fetchedArchetypes);

        setArchetypes(fetchedArchetypes);
    }

    useEffect(() => {
        fetchArchetypes();
    }, [])

    const handleClick = (deckId: number) => {
        return () => {navigate(`/deckView/${deckId}`);};
    };

    const Archetype = (props: Archetype_t) => {
        console.log(props);
        return (<Button sx={{ width: '100%' }}>
            <Paper
                elevation={3}
                sx={{ width: '100%', padding: 2, backgroundColor: "lightgrey" }}
                onClick={handleClick(props.example_deck_id)}
            >
                <Grid container sx={{ alignItems: 'center'}}>
                    <Grid item xs>
                        <Typography
                            noWrap
                            component="h1"
                            variant="h5"
                            sx = {{
                                padding: 1.25,
                                display: "flex",
                                justifyContent: "left",
                                fontWeight: 600,
                                fontSize: 22,
                                letterSpacing: 1,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                height: 45,
                            }}
                        >
                            {props.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} height='1.5vw'>
                    </Grid>
                </Grid>
                <Typography variant="caption" sx={{ margin: '0.5rem', marginRight: '0.75rem' }}>
                    Popularity: {props.popularity}
                </Typography>
            </Paper>
        </Button>)

    }

    return (
        <Grid container sx={{ alignItems: 'center', padding: 3, paddingTop: 0}} spacing={3} >
            {archetypes.map((deck: Archetype_t) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={deck.id}>
                    <Archetype
                        key={deck.id}
                        id={deck.id}
                        name={deck.name}
                        popularity={deck.popularity}
                        example_deck_id={deck.example_deck_id}
                        format={deck.format}
                    />
                </Grid>
            ))}   
        </Grid>
    );
}

export default TournamentArchetypes;