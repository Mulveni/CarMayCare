import React, { useState } from 'react';
import { Grid, TextField, makeStyles, Button, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { defaultButton, infoText } from '../styles/classes';
import { useForm } from 'react-hook-form';
import baseApiUrl from '../api_url.json';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
    editGrid: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 50
    },
    defaultButton: defaultButton,
    infoText: infoText
});

const CarEdit = ({ data, carId, handleSaveButton }) => {
    const [infoText, setInfoText] = useState(null);

    const carData = data;
    const { t } = useTranslation();
    const classes = useStyles();
    const { register, handleSubmit } = useForm();
    const history = useHistory();

    const apiUrl = baseApiUrl.url;
    const apiToken = useSelector(state => state.tokenReducer);

    const handleCancel = () => {
        handleSaveButton("cancel");
    }

    const onSubmit = (data) => {
        if (checkIfDataIsChanged(data) === false) {
            handleSaveButton("submit");
        } else {
            axios.put(`${apiUrl}/cars/${carId}`, data, {
                headers: {
                    Authorization: `Bearer ${apiToken}`
                }
            }).then(() => {
                handleSaveButton("submit");
            }).catch(error => {
                if (error.response.status === 404 && error.response.data.message === "User has no cars with given id") {
                    console.log("ID not found");
                    setInfoText(t('error_car_id_not_found'));
                }
                else if (error.response.data === "Unauthorized") {
                    history.push("/login", { error: t('unauthorized') });
                } else {
                    setInfoText(t('internal_server_error'));
                }
            });
        }
    }

    const onError = (errors) => {
        const firstValue = errors[Object.keys(errors)[0]];
        setInfoText(firstValue.message);
    }

    const checkIfDataIsChanged = (data) => {
        let dataChanged = false;
        for (const key in data) {
            if (data[key] !== carData[key]) {
                dataChanged = true;
            }
        }
        return dataChanged;
    }

    return (
        <>
            <Grid container item xs={4} justify="center" alignItems="center" style={{ paddingTop: 25, paddingBottom: 25 }} >

                <Grid container item justify="center">

                    <TextField
                        variant="outlined"
                        margin="normal"
                        name="brand"
                        label={t('car_brand')}
                        defaultValue={carData.brand}
                        inputRef={register({
                            required: t('car_brand') + " " + t('error_required'),
                            minLength: { value: 2, message: t('car_brand') + " " + t('error_shorter') + " 2 " + t('error_characters') }
                        })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        name="model"
                        label={t('car_model')}
                        defaultValue={carData.model}
                        inputRef={register({
                            required: t('car_model') + " " + t('error_required'),
                            minLength: { value: 2, message: t('car_model') + " " + t('error_shorter') + " 2 " + t('error_characters') }
                        })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        name="yearModel"
                        label={t('car_yearmodel')}
                        defaultValue={carData.yearModel}
                        inputRef={register({
                            required: t('car_yearmodel') + " " + t('error_required'),
                            minLength: { value: 4, message: t('car_yearmodel') + " " + t('error_shorter') + " 4 " + t('error_characters') },
                            maxLength: { value: 4, message: t('car_yearmodel') + " " + t('error_longer') + " 4 " + t('error_characters') },
                            min: { value: "1900", message: t('car_yearmodel') + " " + t('error_number') + " 1900 - 2100 " },
                            max: { value: "2100", message: t('car_yearmodel') + " " + t('error_number') + " 1900 - 2100 " },
                            pattern: {
                                value: /[0-9]/,
                                message: t('car_yearmodel') + t('error_inputs') + " 0-9"
                            }
                        })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        name="powerType"
                        label={t('car_powertype')}
                        defaultValue={carData.powerType}
                        inputRef={register({
                            required: t('car_powertype') + " " + t('error_required'),
                            minLength: { value: 2, message: t('car_powertype') + " " + t('error_shorter') + " 2 " + t('error_characters') }
                        })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        name="engineSize"
                        label={t('car_enginesize')}
                        defaultValue={carData.engineSize}
                        inputRef={register({
                            required: t('car_enginesize') + " " + t('error_required'),
                            minLength: { value: 2, message: t('car_enginesize') + " " + t('error_shorter') + " 2 " + t('error_characters') }
                        })}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        name="licenseNumber"
                        label={t('car_license')}
                        defaultValue={carData.licenseNumber}
                        inputRef={register({
                            required: t('car_license') + " " + t('error_required'),
                            minLength: { value: 2, message: t('car_license') + " " + t('error_shorter') + " 2 " + t('error_characters') }
                        })}
                    />
                </Grid>
            </Grid>
            <Grid container item xs={4} direction="column" alignItems="flex-end" style={{ paddingTop: 25, paddingRight: 10 }} >

                <Grid container item direction="row" justify="flex-end">
                    <Button onClick={handleCancel} className={classes.defaultButton} style={{ marginRight: 10 }} >
                        {t('button_cancel')}
                    </Button>
                    <Button onClick={handleSubmit(onSubmit, onError)} className={classes.defaultButton} >
                        {t('button_save')}
                    </Button>
                </Grid>

                <Typography className={classes.infoText} variant="body1">
                    {infoText}
                </Typography>

            </Grid>
        </>
    )
}

export default CarEdit;