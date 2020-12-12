import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { hideNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import { TextField, Grid, Button, makeStyles, Card, Typography, Link } from '@material-ui/core';
import axios from 'axios';
import baseApiUrl from '../api_url.json';
import adminUser from '../admin_user.json';
import { infoText, defaultButton, background, defaultLink } from '../styles/classes';
import Loading from './Loading';

const useStyles = makeStyles({
    forgotPasswordGrid: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 50
    },
    background,
    infoText: infoText,
    defaultButton: defaultButton,
    defaultLink
});

const ForgotPassword = () => {
    const [sent, setSent] = useState(false);
    const [forgotPasswordText, setForgotPasswordText] = useState(null);
    const emailInput = useRef(null);
    const [isLoading, setLoading] = useState(false);

    const { t } = useTranslation();
    const classes = useStyles();

    const apiUrl = baseApiUrl.url;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideNavButtons());
    }, [dispatch]);

    const MessageSent = () => {
        return (
            <div>
                <Card className={classes.background} style={{ marginTop: 50 }}>
                    <Grid container item xs={12} direction="column" justify="center" alignItems="center" style={{ paddingTop: 25, paddingBottom: 25 }}>
                        <Typography variant="h5">
                            {t('forgot_password_sent_message')}
                        </Typography>
                        <Link className={classes.defaultLink} href="/login">{t('login_here')}</Link>
                    </Grid>
                </Card>
            </div >
        )
    }

    const ForgotPasswordForm = () => {

        const pressKey = (e) => {
            if (e.code === "Enter") {
                handleSubmit();
            }
        }

        const handleSubmit = () => {
            setForgotPasswordText(null);
            if (emailInput.current.value.length < 1) {
                setForgotPasswordText(t('empty_field'));
            }
            else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.current.value) === false) {
                setForgotPasswordText(t('invalid_email'));
            } else {
                setLoading(true);
                sendEmail(emailInput.current.value);
            }
        }

        const sendEmail = (email) => {
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
                    setLoading(false);
                }).catch(error => {
                    if (error.response.status === 400 && error.response.data.message === "User already has valid link.") {
                        setSent(true);
                    }
                    else if (error.response.status === 404 && error.response.data.message === "No user for this email.") {
                        setSent(true);
                    } else {
                        setForgotPasswordText(t('internal_server_error'));
                    }
                    setLoading(false);
                });
            }).catch(error => {
                setForgotPasswordText(t('internal_server_error'));
                setLoading(false);
            });
        }
        if (isLoading) {
            return <Loading />;
        }


        return (
            <div>
                <Card className={classes.background} style={{ marginTop: 50 }}>
                    <Grid container item xs={12} direction="column" justify="center" alignItems="center" style={{ paddingTop: 25 }}>
                        <div className={classes.forgotPasswordGrid}>
                            <Typography variant="h5">
                                {t('forgot_password_header')}
                            </Typography>
                            <TextField
                                onKeyDown={pressKey}
                                id="email"
                                label={t('email')}
                                variant="outlined"
                                margin="normal"
                                inputRef={emailInput}
                            />
                            <Typography className={classes.infoText}>{forgotPasswordText}</Typography>
                            <Button
                                className={classes.defaultButton}
                                onClick={handleSubmit}
                                variant="contained"
                                style={{ marginTop: 50 }}>
                                {t('send')}
                            </Button>
                            <Link className={classes.defaultLink} href="/login">{t('login_here')}</Link>
                        </div>
                    </Grid>
                </Card>
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