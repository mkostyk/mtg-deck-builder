import React, { useState } from 'react';

import { Grid, IconButton, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Paper, Button } from '@mui/material';
import { MoreVert, Edit, Delete, Public, Lock } from '@mui/icons-material';

export interface Deck_t {
    id: number;
    name: string;
    private: boolean;
}

function Deck (props: Deck_t) {
    const [anchorButtonMenu, setAnchorButtonMenu] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorButtonMenu);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorButtonMenu(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorButtonMenu(null);
    };

    const handleEdit = () => {
        console.log("Edit");
        handleClose();
    };

    const handleDelete = () => {
        console.log("Delete");
        handleClose();
    };

    const button_id:string = `button-${props.id}`;
    const menu_id:string = `menu-${props.id}`;

    const publicHTML = (
        <Grid container sx={{ alignItems: 'center' }}>
            <Grid item>
                <Typography variant="subtitle1" sx={{ margin: '0.5rem', marginLeft: '0.75rem' }}>
                    {props.private? "Private" : "Public"}
                </Typography>
            </Grid>
            <Grid item>
                {props.private? <Lock /> : <Public />}
            </Grid>
        </Grid>
    )

    const deckClicked = () => {
        console.log("Deck clicked");
    }

    const deckHTML = (
        <Button onClick={deckClicked} sx={{ width: '100%' }}>
            <Paper elevation={3} sx={{ width: '100%' }}>
                <Grid container sx={{ alignItems: 'center' }}>
                    <Grid item xs>
                        <Typography component="h1" variant="h5" sx={{ margin: '0.5rem' }}>
                            {props.name}
                        </Typography>

                        {publicHTML}
                    </Grid>
                    <Grid item>
                        <IconButton id={button_id} onClick={handleOpen} color="primary">
                            <MoreVert />
                        </IconButton>

                        <Menu id={menu_id} anchorEl={anchorButtonMenu} open={open} onClose={handleClose} >
                            <MenuItem onClick={handleEdit}>
                                <ListItemIcon>
                                    <Edit fontSize="small" />
                                </ListItemIcon>

                                <ListItemText>
                                    Edit
                                </ListItemText>
                            </MenuItem>

                            <MenuItem onClick={handleDelete}>
                                <ListItemIcon>
                                    <Delete fontSize="small" />
                                </ListItemIcon>

                                <ListItemText>
                                    Delete
                                </ListItemText>
                            </MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
            </Paper>
        </Button>
    )

    return (
        deckHTML
    );
}

export default Deck;