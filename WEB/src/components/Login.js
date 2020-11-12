import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideNavButtons, logIn } from '../actions';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TextField, Grid, Button } from '@material-ui/core';
import axios from 'axios';

const Login = () => {
    const [loginText, setloginText] = useState(null);
    const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });

    const { t } = useTranslation();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideNavButtons());
    }, []);

    const loginUser = () => {
        dispatch(logIn());
    }

    const handleEmailChange = (e) => {
        setLoginInfo({ email: e.target.value, password: loginInfo.password });
    }

    const handlePasswordChange = (e) => {
        setLoginInfo({ email: loginInfo.email, password: e.target.value });
    }

    const handleLogin = () => {
        setloginText(null);
        if (loginInfo.email.length < 1 || loginInfo.password.length < 1) {
            setloginText(t('empty_field'));
        }
    }


    return (
        <div>
            LOGIN PAGE
            <br />
            <Link onClick={loginUser} to="/">Login</Link>

            <Grid container justify="center">
                <div style={{ display: "flex", flexDirection: "column", maxWidth: 400, minWidth: 300, marginTop: 50 }}>
                    <TextField
                        onChange={handleEmailChange}
                        id="email"
                        label="Email"
                        variant="outlined"
                        margin="normal"
                    />
                    <TextField
                        onChange={handlePasswordChange}
                        id="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                    />
                    <p>{loginText}</p>
                    <Button
                        onClick={handleLogin}
                        variant="contained"
                        style={{ marginTop: 50 }}>
                        {t('login')}
                    </Button>
                </div>
            </Grid>



        </div >
    )
}

export default Login;