import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, TextField, Input, CssBaseline, Container, InputAdornment, IconButton, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { requestPath } from "../utils";
import NavBar from "./NavBar";
import { CardSearch } from './CardSearch';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import DeckSearchResult from "./DeckSearchResult";
import CardSearchResult from "./CardSearchResult";
import TournamentArchetypes from "./TournamentArchetypes";
import DeckView from "./DeckView";
import CardView from "./CardView";
import { DeckSearch } from "./DeckSearch";
import { UserDecks } from './UserDecks';
import { LoginContext } from "./LoginContext";
import { useState, useEffect } from "react";


function App() {
    const navigate = useNavigate();

    const theme = createTheme();
    const [login, setLogin] = useState(false);

    const checkLogin = async() => {
        const token = localStorage.getItem("token");



        const userId = await fetch(`${requestPath}/token/?token=${token}`, {
            method: 'GET'
        })

        let loggedIn: boolean;

        if(!userId.ok) {
            setLogin(false);
            loggedIn = false;
        } else {

            const userIdJson = await userId.json();

            setLogin(userIdJson.user_id);
            loggedIn=userIdJson.user_id;
        }

        if(loggedIn) {
            navigate("/userDecks");
        } else {
            navigate("/cardSearch")
        }
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
                    <Route path="deckSearchResult" element={<DeckSearchResult />} />
                    <Route path="deckView/:id" element={<DeckView />} />
                    <Route path="cardSearch" element={<CardSearch />} />
                    <Route path="cardSearchResult" element={<CardSearchResult />} />
                    <Route path="cardView" element={<CardView />} />
                    <Route path="deckSearch" element={<DeckSearch />} />
                    <Route path="userDecks" element={<UserDecks />} />
                    <Route path="tournamentArchetypes" element={<TournamentArchetypes />} />
                </Routes>
            </ThemeProvider>
        </LoginContext.Provider>
    );
}

export default App;
