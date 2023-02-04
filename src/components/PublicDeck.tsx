import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Grid, IconButton, Typography, Menu, MenuItem, ListItemIcon, ListItemText,
         Paper, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import { MoreVert, Edit, Delete, Public, Lock, AutoFixHighRounded } from '@mui/icons-material';

import { requestPath } from "../utils";
import { useEffect } from 'react';

export interface Deck_t {
    id: number;
    name: string;
    private: boolean;
    updateMethod: any;
    mine: boolean;
    author: string;
    last_update: string;
}

function PublicDeck (props: Deck_t) {
    const [anchorButtonMenu, setAnchorButtonMenu] = useState<null | HTMLElement>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [author, setAuthor] = useState("");

    useEffect(() =>
        {fetchAuthor();}, []
    )

    const fetchAuthor = async () => {
        const authorRequest = await fetch(`${requestPath}/users/?user_id=${props.author}`, {
            method: 'GET',
        })

        if(!authorRequest.ok) {
            return;
        }

        const authorJson = await authorRequest.json();

        console.log(authorJson);

        setAuthor(authorJson.username);
    }

    const open = Boolean(anchorButtonMenu);
    const navigate = useNavigate();

    const handleOpen = (event: any) => {
        event.stopPropagation();
        setAnchorButtonMenu(event.currentTarget);
    };

    const handleClose = (event: any) => {
        event.stopPropagation();
        setAnchorButtonMenu(null);
    };

    const handleShowAlert = () => {
        setShowAlert(true);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const handleEdit = (event: any) => {
        console.log("Clicked");
        handleClose(event);
        navigate(`/deckView/${props.id}`);
    };

    const handleDelete = (event: any) => {
        handleShowAlert();
        handleClose(event);
    };

    const handleDeleteDeck = () => {
        handleCloseAlert();

        //TODO
        fetch(`${requestPath}/decks/?id=${props.id}`, {
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
                <Button variant="contained" onClick={handleCloseAlert} autoFocus sx={{ marginLeft: '0.75rem' }}> No, save it for now </Button>
                <Button variant="contained" color="error" onClick={handleDeleteDeck} sx={{ marginRight: '0.75rem' }}> Yes, I want to delete it </Button>
            </DialogActions>
      </Dialog>
    )

    const publicHTML = (
        <Grid container sx={{ alignItems: 'center' }}>
            <Grid item sx={{ padding: 0.75 }}>
                {props.private? <Lock /> : <Public />}
            </Grid>
            <Grid item>
                <Typography variant="subtitle1">
                    {props.private? <span style = {{color: "red"}}>Private</span> : <span style = {{color: "green"}}>Public</span>}
                </Typography>
            </Grid>
        </Grid>
    )


    const menu = (
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
    )

    // This grid item in the middle is a bad workaround and probably not the best way to do this.
    const footer = (
        <Grid container justifyContent='flex-start'>
            <Grid item>
                <Typography variant="caption" sx={{ margin: '0.5rem', marginLeft: '0.75rem' }}>
                    Author: {author}
                </Typography>
            </Grid>

            <Grid item xs>
            </Grid>

            <Grid item>
                <Typography variant="caption" sx={{ margin: '0.5rem', marginRight: '0.75rem' }}>
                    Last updated: {props.last_update.split("T")[0]}
                </Typography>
            </Grid>
        </Grid>
        
    )

    const deckHTML = (
        <Button sx={{ width: '100%' }}>
            <Paper
                elevation={3}
                sx={{ width: '100%', padding: 2, backgroundColor: "lightgrey" }}
                onClick={props.mine? handleOpen: handleEdit}
            >
                {menu}
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

                        {publicHTML}
                    </Grid>
                    <Grid item xs={12} height='1.5vw'>
                    </Grid>
                </Grid>
                {footer}
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

export default PublicDeck;