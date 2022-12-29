import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Grid, IconButton, Typography, Menu, MenuItem, ListItemIcon, ListItemText,
         Paper, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import { MoreVert, Edit, Delete, Public, Lock } from '@mui/icons-material';

export interface Deck_t {
    id: number;
    name: string;
    private: boolean;
    updateMethod: any;
}

function Deck (props: Deck_t) {
    const [anchorButtonMenu, setAnchorButtonMenu] = useState<null | HTMLElement>(null);
    const [showAlert, setShowAlert] = useState(false);

    const open = Boolean(anchorButtonMenu);
    const navigate = useNavigate();

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorButtonMenu(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorButtonMenu(null);
    };

    const handleShowAlert = () => {
        setShowAlert(true);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const handleEdit = () => {
        handleClose();
        navigate(`/deckView/${props.id}`);
    };

    const handleDelete = () => {
        handleShowAlert();
        handleClose();
    };

    const handleDeleteDeck = () => {
        handleCloseAlert();
        fetch(`http://localhost:8000/decks/?id=${props.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem("token"),
            }     
        }).then((response) => {
            if (!response.ok) {
                console.log("Error") // TODO
                return;
            }

            console.log("Delete"); // TODO
            props.updateMethod();
        });
    };

    const button_id:string = `button-${props.id}`;
    const menu_id:string = `menu-${props.id}`;

    const alert = (
        <Dialog open={showAlert} onClose={handleCloseAlert}>
            <DialogTitle id="delete-dialog">
                Delete deck
            </DialogTitle>

            <DialogContent>
                <DialogContentText id="delete-dialog-description">
                    Are you sure you want to delete this deck?
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button variant="contained" onClick={handleCloseAlert} autoFocus> No, save it for now </Button>
                <Button variant="contained" color="error" onClick={handleDeleteDeck}> Yes, I want to delete it </Button>
            </DialogActions>
      </Dialog>
    )

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
        <div>
            {deckHTML}
            {alert}
        </div>
    );
}

export default Deck;