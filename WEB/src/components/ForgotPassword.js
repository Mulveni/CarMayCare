import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hideNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import { TextField, Grid, Button, makeStyles } from '@material-ui/core';

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

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideNavButtons());
    }, []);


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
                setSent(true);
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