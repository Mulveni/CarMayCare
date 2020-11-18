import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideNavButtons, logIn, addToken } from '../actions';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TextField, Grid, Button, makeStyles } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import baseApiUrl from '../api_url.json';


const useStyles = makeStyles({
    loginGrid: {
        display: "flex", flexDirection: "column",
        maxWidth: 400,
        minWidth: 300,
        marginTop: 50
    },
    link: {
        display: "flex",
        justifyContent: "center",
        marginTop: 25
    }
});

const Login = () => {
    const [loginText, setloginText] = useState(null);
    const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });

    const { t } = useTranslation();
    const history = useHistory();
    const classes = useStyles();

    const apiUrl = baseApiUrl.url;


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideNavButtons());
    }, []);

    const handleEmailChange = (e) => {
        setLoginInfo({ email: e.target.value, password: loginInfo.password });
    }

    const handlePasswordChange = (e) => {
        setLoginInfo({ email: loginInfo.email, password: e.target.value });
    }

    const pressKey = (e) => {
        if (e.code === "Enter") {
            handleLogin();
        }
    }

    const handleLogin = () => {
        setloginText(null);
        if (loginInfo.email.length < 1 || loginInfo.password.length < 1) {
            setloginText(t('empty_field'));
        } else {
            axios.post(`${apiUrl}/login`, null, {
                auth: {
                    username: loginInfo.email,
                    password: loginInfo.password
                }
            }).then(response => {
                dispatch(logIn());
                dispatch(addToken(response.data.token));
                history.push("/");
            }).catch(error => {
                if (error.response.data === "Unauthorized") {
                    setloginText(t('incorrect_login'));
                } else {
                    setloginText(t('internal_server_error'));
                }

            });
        }
    }


    return (
        <div>
            <Grid container justify="center">
                <div className={classes.loginGrid}>
                    <TextField
                        onChange={handleEmailChange}
                        onKeyDown={pressKey}
                        id="email"
                        label={t('email')}
                        variant="outlined"
                        margin="normal"
                    />
                    <TextField
                        onChange={handlePasswordChange}
                        onKeyDown={pressKey}
                        id="password"
                        label={t('password')}
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
                    <Link className={classes.link} to="/forgotpassword" >{t('forgot_password')}</Link>
                    <Link className={classes.link} to="/register" >{t('register_here')}</Link>
                </div>
            </Grid>



        </div >
    )
}

export default Login;