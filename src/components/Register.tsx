import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { AccountCircle } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, Input, TextField, Typography, CssBaseline, Container, Grid, Link } from '@mui/material';

function Register() {
    const [token, settoken] = useState(localStorage.getItem(localStorage.getItem("token") || "null"));
    const navigate = useNavigate();

    const handleRegister = (event: any) => {
        event.preventDefault()
        fetch('http://localhost:8000/auth/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: event.target.username.value,
                password: event.target.password.value
            })
        }).then((response) => {
            if (!response.ok) {
                console.log("Error") // TODO
                return;
            }

            response.json().then((data) => {
                localStorage.setItem("token", data.token);
                settoken(data.token);

                navigate("/dashboard");
            });
        });
    }

    const registerForm = (
        <Box component="form" onSubmit={handleRegister} 
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', marginTop: 12}}>
            <AccountCircle sx={{ fontSize: 45 }} />
            <Typography component="h1" variant="h5" sx={{ margin: '0.5rem' }}>
                Register an account
            </Typography>

            <TextField id="username-input" name="username" label="Username" type="text" fullWidth required sx={{ margin: '0.5rem' }} >
                <Input defaultValue="" />
            </TextField>

            <TextField id="password-input" name="password" label="Password" type="password" fullWidth required sx={{ margin: '0.5rem' }} >
                <Input defaultValue="" />
            </TextField>

            <Button id="register-submit" variant="contained" type="submit" fullWidth sx={{ margin: '0.5rem' }} >
                Login
            </Button>

            <Grid container>
                <Grid item xs>
                    <Link href="/login" variant="body2">
                    Go back to login
                    </Link>
                </Grid>
            </Grid>
        </Box>
    )
    
    const theme = createTheme(); // TODO - custom theme

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container component="main" maxWidth="xs">
                {registerForm}
            </Container>
        </ThemeProvider>
    );
}

export default Register;