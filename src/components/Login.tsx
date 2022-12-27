import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LockPerson } from '@mui/icons-material';
import { Box, TextField, Typography, Button, CssBaseline, Input, Grid, Link, Container } from '@mui/material';


function Login() {
    const [token, settoken] = useState(localStorage.getItem(localStorage.getItem("token") || "null"));
    const navigate = useNavigate();

    const handleLogin = (event: any) => {
        event.preventDefault()
        fetch('http://localhost:8000/auth/login/', {
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
    
    const loginForm = (
        
        <Box component="form" onSubmit={handleLogin} 
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', marginTop: 12}}>
            <LockPerson sx={{ fontSize: 45 }} />
            <Typography component="h1" variant="h5" sx={{ margin: '0.5rem' }}>
                Login
            </Typography>

            <TextField id="username-input" name="username" label="Username" type="text" fullWidth required sx={{ margin: '0.5rem' }} >
                <Input defaultValue="" />
            </TextField>

            <TextField id="password-input" name="password" label="Password" type="password" fullWidth required sx={{ margin: '0.5rem' }} >
                <Input defaultValue="" />
            </TextField>

            <Button id="login-submit" variant="contained" type="submit" fullWidth sx={{ margin: '0.5rem' }} >
                Login
            </Button>

            <Grid container>
                <Grid item xs>
                    <Link href="#" variant="body2">
                    Forgot password?
                    </Link>
                </Grid>

                <Grid item>
                    <Link href="/register" variant="body2" align="right">
                    Sign up
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
                {loginForm}
            </Container>
        </ThemeProvider>

    );
}

export default Login;