import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, TextField, Input, CssBaseline, Container, InputAdornment, IconButton, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function App() {
    const navigate = useNavigate();

    const handleSearchDecks = (event: any) => {
        event.preventDefault();

        fetch(`http://localhost:8000/decks/?name=${event.target.search.value}`, {
            method: 'GET' // TODO - auth header if there is a token in localStorage
        }).then((response) => {
            if (!response.ok) {
                console.log("Error") // TODO
                return;
            }

            response.json().then((data) => {
                localStorage.setItem("decks", JSON.stringify(data));
                navigate('/searchResult')
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

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container component="main" maxWidth="xs">
                {searchField}
            </Container>
        </ThemeProvider>
    );
}

export default App;
