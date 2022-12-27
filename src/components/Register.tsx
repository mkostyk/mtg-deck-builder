import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

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
        <div className="login-form">
            <form onSubmit={handleRegister}>
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
        registerForm
    );
}

export default Register;