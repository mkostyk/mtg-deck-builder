import Card, { Card_t } from './Card';
import { Grid } from '@mui/material';
import { useState } from 'react';

export interface Cardlist_t {
    data: Array<Card_t>;
}

function Cardlist (props: Cardlist_t) {   
    const cardlistHTML = (
        <Grid container sx={{ alignItems: 'center', marginTop: 2 }} spacing={3} >
            {props.data.map((card: Card_t) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={card.id}>
                    <Card key={card.id} id={card.id} card_id={card.card_id}/>
                </Grid>
                )
            )}   
        </Grid>   
    )

    return (
        cardlistHTML
    );
}

export default Cardlist;