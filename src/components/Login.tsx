import React from 'react';

function Login() {

    const handleLogin = (event: any) => {
        console.log("Logged in")
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
        })
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