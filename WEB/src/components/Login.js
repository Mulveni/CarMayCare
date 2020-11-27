import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { hideNavButtons, logIn, addToken } from '../actions';
import { useTranslation } from 'react-i18next';
import { TextField, Grid, Button, makeStyles, Link, Typography } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import baseApiUrl from '../api_url.json';
import { infoText, defaultButton, defaultLink } from '../styles/classes';


const useStyles = makeStyles({
    loginGrid: {
        display: "flex", flexDirection: "column",
        maxWidth: 400,
        minWidth: 300,
        marginTop: 50
    },
    defaultLink: defaultLink,
    defaultButton: defaultButton,
    infoText: infoText
});

const Login = () => {
    const [loginText, setloginText] = useState(null);
    const emailInput = useRef(null);
    const passwordInput = useRef(null);

    const { t } = useTranslation();
    const history = useHistory();
    const classes = useStyles();

    const apiUrl = baseApiUrl.url;


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideNavButtons());
    }, [dispatch]);

    const pressKey = (e) => {
        if (e.code === "Enter") {
            handleLogin();
        }
    }

    const clearInputs = () => {
        emailInput.current.value = null;
        passwordInput.current.value = null;
    }

    const handleLogin = () => {
        setloginText(null);
        if (emailInput.current.value.length < 1 || passwordInput.current.value.length < 1) {
            setloginText(t('empty_field'));
        } else {
            axios.post(`${apiUrl}/login`, null, {
                auth: {
                    username: emailInput.current.value,
                    password: passwordInput.current.value
                }
            }).then(response => {
                clearInputs();
                dispatch(logIn());
                dispatch(addToken(response.data.token));
                history.push("/");
            }).catch(error => {
                clearInputs();
                if (error.response === undefined) {
                    setloginText(t('internal_server_error'));
                } else {
                    if (error.response.data === "Unauthorized") {
                        setloginText(t('incorrect_login'));
                    } else {
                        setloginText(t('internal_server_error'));
                    }
                }
            });
        }
    }


    return (
        <div>
            <Grid container justify="center">
                <div className={classes.loginGrid}>
                    <TextField
                        onKeyDown={pressKey}
                        id="email"
                        label={t('email')}
                        variant="outlined"
                        margin="normal"
                        inputRef={emailInput}
                    />
                    <TextField
                        onKeyDown={pressKey}
                        id="password"
                        label={t('password')}
                        type="password"
                        variant="outlined"
                        margin="normal"
                        inputRef={passwordInput}
                    />
                    <Typography className={classes.infoText} variant="body1">
                        {loginText}
                    </Typography>
                    <Button
                        className={classes.defaultButton}
                        onClick={handleLogin}
                        variant="contained"
                        style={{ marginTop: 50 }}>
                        {t('login')}
                    </Button>
                    <Link className={classes.defaultLink} href="/forgotpassword" >{t('forgot_password')}</Link>
                    <Link className={classes.defaultLink} href="/register" >{t('register_here')}</Link>
                </div>
            </Grid>



        </div >
    )
}

export default Login;