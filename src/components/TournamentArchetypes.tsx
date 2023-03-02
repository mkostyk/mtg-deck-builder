import { Grid, IconButton, Typography, Paper, Button } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { requestPath } from "../utils";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

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
    const [page, setPage] = useState(1);
    const [nextPage, setNextPage] = useState(false);

    const fetchArchetypes = async () => {
        const archetypesRequest = await fetch(`${requestPath}/tournamentArchetypes/?page=${page}&archetype=`, {
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

            return {id: archetype.id, name: archetype.name, popularity: archetype.popularity, example_deck_id: deckJson.deck_id, format: deckJson.tournament_format};
        }));

        console.log(fetchedArchetypes);

        setArchetypes(fetchedArchetypes);

        const checkNextPage = await fetch(`${requestPath}/tournamentArchetypes/?page=${page+1}&archetype=`, {
            method: 'GET',
        });

        if (!checkNextPage.ok) {
            setNextPage(false);
            return;
        }

        const nextPageJson = await checkNextPage.json();
        
        setNextPage(nextPageJson.length > 0);
    }

    useEffect(() => {
        fetchArchetypes();
    }, [page])

    const handleClick = (deckId: number) => {
        return () => {navigate(`/deckView/${deckId}`);};
    };

    const incrementPage = () => {
        setPage(page + 1);
    }

    const decrementPage = () => {
        setPage(page - 1);
    }

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
                <Grid container justifyContent='flex-start'>
                    <Grid item>
                        <Typography variant="caption" sx={{ margin: '0.5rem', marginRight: '0.75rem' }}>
                            Format: {props.format}
                        </Typography>
                    </Grid>

                    <Grid item xs>
                    </Grid>

                    <Grid item>
                        <Typography variant="caption" sx={{ margin: '0.5rem', marginRight: '0.75rem' }}>
                            Popularity: {props.popularity}%
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Button>)

    }

    return (
        <div>
            <Typography variant="h3" sx = {{padding: 6, width: "100%", display: "flex", justifyContent: "center"}}>
                {page > 1?
                <IconButton aria-label="delete" onClick={decrementPage} sx = {{width: 48, height: 48, marginTop: 0}}>
                    <NavigateBeforeIcon/>
                </IconButton> :
                <div style = {{width: 48}}></div>}
                Tournament archetypes
                {nextPage ?
                <IconButton aria-label="delete" onClick={incrementPage} sx = {{width: 48, height: 48, marginTop: 0}}>
                    <NavigateNextIcon />
                </IconButton> :
                <div style = {{width: 48}}></div>}
            </Typography>
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
        </div>
    );
}

export default TournamentArchetypes;