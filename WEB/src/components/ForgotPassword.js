import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hideNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import { TextField, Grid, Button, makeStyles } from '@material-ui/core';
import axios from 'axios';
import baseApiUrl from '../api_url.json';
import adminUser from '../admin_user.json';

const useStyles = makeStyles({
    forgotPasswordGrid: {
        display: "flex", flexDirection: "column",
        maxWidth: 400,
        minWidth: 300,
        marginTop: 50
    }
});

const ForgotPassword = () => {

    const [sent, setSent] = useState(false);

    const { t } = useTranslation();
    const classes = useStyles();

    const apiUrl = baseApiUrl.url;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideNavButtons());
    }, []);

    console.log(localStorage.getItem('i18nextLng'));


    const MessageSent = () => {
        return (
            <div style={{ marginTop: 50 }}>
                <Grid container justify="center">
                    <h1>{t('forgot_password_sent_message')}</h1>
                </Grid>
            </div>
        )
    }

    const ForgotPasswordForm = () => {
        const [forgotPasswordText, setForgotPasswordText] = useState(null);
        const [email, setEmail] = useState("");

        const handleEmailChange = (e) => {
            setEmail(e.target.value);
        }

        const pressKey = (e) => {
            if (e.code === "Enter") {
                handleSubmit();
            }
        }

        const handleSubmit = () => {
            setForgotPasswordText(null);
            if (email.length < 1) {
                setForgotPasswordText(t('empty_field'));
            }
            else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) === false) {
                setForgotPasswordText(t('invalid_email'));
            } else {
                axios.post(`${apiUrl}/login`, null, {
                    auth: {
                        username: adminUser.email,
                        password: adminUser.password
                    }
                }).then(response => {
                    axios.post(`${apiUrl}/email`, {
                        email: email,
                        lng: localStorage.getItem('i18nextLng')
                    }, {
                        headers: {
                            Authorization: `Bearer ${response.data.token}`
                        }
                    }).then(response => {
                        if (response.status === 201) {
                            setSent(true);
                        } else {
                            setForgotPasswordText(t('unknown_reason'));
                        }
                    }).catch(error => {
                        if (error.response.status === 400 && error.response.data.message === "User already has valid link.") {
                            setForgotPasswordText(t('already_has_reset_link'));
                        } else {
                            setForgotPasswordText(t('internal_server_error'));
                        }
                    });
                }).catch(error => {
                    setForgotPasswordText(t('internal_server_error'));
                });
            }
        }


        return (
            <div>
                <Grid container justify="center">
                    <div className={classes.forgotPasswordGrid}>
                        <h1>{t('forgot_password_header')}</h1>
                        <TextField
                            onChange={handleEmailChange}
                            onKeyDown={pressKey}
                            id="email"
                            label={t('email')}
                            variant="outlined"
                            margin="normal"
                        />
                        <p>{forgotPasswordText}</p>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            style={{ marginTop: 50 }}>
                            {t('send')}
                        </Button>
                    </div>
                </Grid>
            </div >
        )
    }

    return (
        <>
            {!sent ? <ForgotPasswordForm /> : <MessageSent />}
        </>
    )
}

export default ForgotPassword;