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
                <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
                    <Card key={card.id} id={card.id} />
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