import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login() {
    const [token, settoken] = useState(localStorage.getItem(localStorage.getItem("token")|| "0"));
    const navigate = useNavigate();

    const handleLogin = (event: any) => {
        console.log("Logged in") // TODO
        event.preventDefault()
        fetch('https://mtg-deck-builder-api-dev.herokuapp.com/auth/login/', {
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
                console.log(localStorage.getItem("token")); // TODO
                navigate("/dashboard");
            });
        });
    }
    
    const loginForm = (
        <div className="login-form">
            <form onSubmit={handleLogin}>
                <div className="form-input-container">
                    <label htmlFor="username">Username: </label>
                    <input type="text" name="username" required/>
                </div>

                <div className="form-input-container">
                    <label htmlFor="password">Password: </label>
                    <input type="password" name="password" required/>
                </div>

                <div className="form-button-container">
                    <input type="submit" />
                </div>

            </form>
        </div>
    )

    return (
        loginForm
    );
}

export default Login;