import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import { hideNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import NotFound from '../components/NotFound';
import axios from 'axios';
import { Grid, Button, makeStyles, Typography, Card } from '@material-ui/core';
import baseApiUrl from '../api_url.json';
import adminUser from '../admin_user.json';
import Error from './Error';
import Loading from './Loading';
import { infoText, defaultButton, background } from '../styles/classes';

const useStyles = makeStyles({
    resetPasswordGrid: {
        display: "flex", flexDirection: "column",
        maxWidth: 400,
        minWidth: 300,
        marginTop: 50
    },
    background: background,
    infoText: infoText,
    defaultButton: defaultButton
});

const ResetPassword = () => {
    const [idValid, setIdValid] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [serverError, setServerError] = useState(false);
    const { id } = useParams();
    const { t } = useTranslation();
    const classes = useStyles();

    const apiUrl = baseApiUrl.url;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideNavButtons());
    }, [dispatch]);

    const checkLinkParameter = () => {
        axios.post(`${apiUrl}/login`, null, {
            auth: {
                username: adminUser.email,
                password: adminUser.password
            }
        }).then(response => {
            axios.get(`${apiUrl}/email`, {
                headers: {
                    Authorization: `Bearer ${response.data.token}`
                },
                params: {
                    link: id
                }

            }).then(response => {
                setIdValid(true);
                setLoading(false);
            }).catch(error => {
                setIdValid(false);
                setLoading(false);
            });
        }).catch(error => {
            setServerError(true);
        });
    }

    useEffect(checkLinkParameter, []);

    const ResetPasswordContent = () => {
        const [sent, setSent] = useState(false);
        const [resetPasswordText, setResetPasswordText] = useState("");

        const handleSubmit = () => {
            axios.post(`${apiUrl}/login`, null, {
                auth: {
                    username: adminUser.email,
                    password: adminUser.password
                }
            }).then(response => {
                axios.post(`${apiUrl}/email/reset`, {
                    link: id,
                    lng: localStorage.getItem('i18nextLng')
                }, {
                    headers: {
                        Authorization: `Bearer ${response.data.token}`
                    }
                }).then(response => {
                    if (response.status === 201) {
                        setSent(true);
                    } else {
                        setResetPasswordText(t('unknown_reason'));
                    }
                }).catch(error => {
                    if (error.response.status === 404) {
                        setResetPasswordText(t('link_expired'));
                    } else {
                        setResetPasswordText(t('internal_server_error'));
                    }

                });
            }).catch(error => {
                setResetPasswordText(t('internal_server_error'));
            });
        }

        return (
            <div>
                {!sent ?

                    <Card className={classes.background} style={{ marginTop: 50 }}>
                        <Grid container xs={12} direction="column" justify="center" alignItems="center" style={{ paddingTop: 25 }}>

                            <Button
                                className={classes.defaultButton}
                                onClick={handleSubmit}
                                variant="contained"
                            >
                                {t('reset_password')}
                            </Button>
                            <Typography className={classes.infoText}>{resetPasswordText}</Typography>
                        </Grid>
                    </Card>


                    :
                    <Card className={classes.background} style={{ marginTop: 50 }}>
                        <Grid container xs={12} direction="column" justify="center" alignItems="center" style={{ paddingTop: 25, paddingBottom: 25 }}>
                            <Typography variant="h5">
                                {t('password_reseted_and_sent')}
                            </Typography>
                        </Grid>
                    </Card>
                }
            </div>
        )
    }

    if (serverError) {
        return <Error />;
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            {!idValid ? <NotFound /> : <ResetPasswordContent />}
        </div >
    )
}

export default ResetPassword;