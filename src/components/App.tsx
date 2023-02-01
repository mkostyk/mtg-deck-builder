import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, TextField, Input, CssBaseline, Container, InputAdornment, IconButton, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { requestPath } from "../utils";
import NavBar from "./NavBar";
import { CardSearch } from './CardSearch';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Register from "./Register";
import DeckSearchResult from "./DeckSearchResult";
import CardSearchResult from "./CardSearchResult";
import DeckView from "./DeckView";
import CardView from "./CardView";
import { DeckSearch } from "./DeckSearch";
import { UserDecks } from './UserDecks';
import { LoginContext } from "./LoginContext";
import { useState, useEffect } from "react";

function App() {
    const navigate = useNavigate();

    const handleSearchDecks = (event: any) => {
        event.preventDefault();

        fetch(`${requestPath}/decks/?name=${event.target.search.value}`, {
            method: 'GET' // TODO - auth header if there is a token in localStorage
        }).then((response) => {
            if (!response.ok) {
                console.log("Error") // TODO
                return;
            }

            response.json().then((data) => {
                localStorage.setItem("decks", JSON.stringify(data));
            });
        });
    }

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
        </Box>
    )

    const theme = createTheme(); // TODO - custom theme
    const [login, setLogin] = useState(false);

    const checkLogin = async() => {
        const token = localStorage.getItem("token");

        const userId = await fetch(`${requestPath}/token/?token=${token}`, {
            method: 'GET'
        })

        if(!userId.ok) {
            return;
        }

        const userIdJson = await userId.json();

        setLogin(userIdJson.user_id);
    }

    useEffect(()=>{
        checkLogin();
    }, []);

    return (
        <LoginContext.Provider value={{login, setLogin}}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <NavBar />
                <Routes>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="deckSearchResult" element={<DeckSearchResult />} />
                    <Route path="deckView/:id" element={<DeckView />} />
                    <Route path="cardSearch" element={<CardSearch />} />
                    <Route path="cardSearchResult" element={<CardSearchResult />} />
                    <Route path="cardView" element={<CardView />} />
                    <Route path="deckSearch" element={<DeckSearch />} />
                    <Route path="userDecks" element={<UserDecks />} />
                </Routes>
            </ThemeProvider>
        </LoginContext.Provider>
    );
}

export default App;
