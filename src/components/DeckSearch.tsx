import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, TextField, Input, CssBaseline, Container, InputAdornment, IconButton, Grid, imageListClasses, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { requestPath } from "../utils";
import NavBar from "./NavBar";
import { ImageAspectRatio } from "@mui/icons-material";
import Stack from '@mui/material/Stack';
import { NumberLiteralType } from "typescript";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export function DeckSearch() {
    const navigate = useNavigate();
    const [format, setFormat] = useState("");

    const handleSearchDecks = async (event: any) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        let decksLikeInfix: any;

        if (token != null) {

            decksLikeInfix = await fetch(`${requestPath}/decks/?page=1&name=${event.target.search.value}&format_name=${format}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem("token")
                }
            });

        } else {
            decksLikeInfix = await fetch(`${requestPath}/decks/?name=${event.target.search.value}`, {
                method: 'GET'
            });
        }

        if (!decksLikeInfix.ok) {
            console.log("Error") //TODO
            return;
        }

        const decksLikeInfixJson = await decksLikeInfix.json();

        localStorage.setItem("decks", JSON.stringify(decksLikeInfixJson));
        navigate('/deckSearchResult');
    }

    const handleChange = (event: SelectChangeEvent) => {
        console.log(event.target.value as string);
      setFormat(event.target.value as string);
    };

    const selectField = (<Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Format</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={format}
            label="Format"
            onChange={handleChange}
          >
            <MenuItem value={"Standard"}>Standard</MenuItem>
            <MenuItem value={"Pioneer"}>Pioneer</MenuItem>
            <MenuItem value={"Modern"}>Modern</MenuItem>
            <MenuItem value={"Legacy"}>Legacy</MenuItem>
            <MenuItem value={"Vintage"}>Vintage</MenuItem>
            <MenuItem value={"Commander"}>Commander</MenuItem>
          </Select>
        </FormControl>
      </Box>)

    const searchField = (
        <Box component="form" onSubmit={handleSearchDecks} 
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', marginTop: 12}}>
            <Typography component="h1" variant="h5" sx={{ margin: '0.5rem' }}>
                Search for decks
            </Typography>

            <Grid container sx={{ alignItems: 'center' }}>
                <Grid item xs>
                    <TextField id="search-decks-input" name="search" label="Search" type="text" fullWidth sx={{ margin: '0.5rem' }}>
                        <Input defaultValue=""/>
                    </TextField>
                </Grid>

                <Grid item>
                    <IconButton type="submit" color='primary' sx={{ margin: '1rem' }}>
                        <SearchIcon />
                    </IconButton>
                </Grid>
            </Grid>       
            {selectField}    
        </Box>
    )

    return searchField;

}