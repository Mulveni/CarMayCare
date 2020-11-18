import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import { hideNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import NotFound from '../components/NotFound';
import axios from 'axios';
import { Grid, Button, makeStyles } from '@material-ui/core';
import baseApiUrl from '../api_url.json';
import adminUser from '../admin_user.json';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
    resetPasswordGrid: {
        display: "flex", flexDirection: "column",
        maxWidth: 400,
        minWidth: 300,
        marginTop: 50
    }
});

const ResetPassword = () => {
    const [idValid, setIdValid] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const { id } = useParams();
    const { t } = useTranslation();
    const classes = useStyles();
    const history = useHistory();

    const apiUrl = baseApiUrl.url;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideNavButtons());
    }, []);

    useEffect(() => {
        checkLinkParameter();
    }, []);

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
            console.log(error.response);
            history.push("/error");
        });
    }

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

                    <Grid container justify="center">
                        <div className={classes.resetPasswordGrid}>
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                style={{ marginTop: 50 }}>
                                {t('reset_password')}
                            </Button>
                            <p>{resetPasswordText}</p>
                        </div>
                    </Grid>


                    :
                    <div style={{ marginTop: 50 }}>
                        <Grid container justify="center" >
                            <h1>{t('password_reseted_and_sent')}</h1>
                        </Grid>
                    </div>
                }
            </div>
        )
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {!idValid ? <NotFound /> : <ResetPasswordContent />}
        </div >
    )
}

export default ResetPassword;