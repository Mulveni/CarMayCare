import React, { useState } from 'react';
import { Grid, Typography, Button, makeStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { defaultButton, infoText } from '../styles/classes';
import axios from 'axios';
import baseApiUrl from '../api_url.json';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
    defaultButton: defaultButton,
    infoText: infoText
});

const CarInfo = ({ data, text, handleEditButton }) => {
    const [infoText, setInfoText] = useState(text);
    const [deleteWindowOpen, setDeleteWindowOpen] = useState(false);
    const carData = data;
    const { t } = useTranslation();
    const classes = useStyles();
    const history = useHistory();

    const apiUrl = baseApiUrl.url;
    const apiToken = useSelector(state => state.tokenReducer);

    const handleWindowOpen = () => {
        setDeleteWindowOpen(true);
    };

    const handleWindowYes = () => {
        axios.delete(`${apiUrl}/cars/${carData.idCars}`, {
            headers: {
                Authorization: `Bearer ${apiToken}`
            }
        }).then(() => {
            handleEditButton("delete");
        }).catch(error => {
            if (error.response.status === 400 && error.response.data.message === "Cannot delete the given car") {
                setInfoText(t('error_car_id_not_found'));
            }
            else if (error.response.data === "Unauthorized") {
                history.push("/login", { error: t('unauthorized') });
            } else {
                setInfoText(t('internal_server_error'));
            }
        });
        setDeleteWindowOpen(false);
    };

    const handleWindowNo = () => {
        setDeleteWindowOpen(false);
    };

    return (
        <>

            <Grid container item xs={4} justify="center" alignItems="center" style={{ paddingTop: 25, paddingBottom: 25 }} >
                <Grid item>
                    <Typography variant="body1">{t('car_brand')}:</Typography>
                    <Typography variant="body1">{t('car_model')}:</Typography>
                    <Typography variant="body1">{t('car_yearmodel')}:</Typography>
                    <Typography variant="body1">{t('car_powertype')}:</Typography>
                    <Typography variant="body1">{t('car_enginesize')}:</Typography>
                    <Typography variant="body1">{t('car_license')}:</Typography>
                </Grid>
                <Grid item style={{ marginLeft: 10 }}>
                    <Typography variant="body1">{carData.brand}</Typography>
                    <Typography variant="body1">{carData.model}</Typography>
                    <Typography variant="body1">{carData.yearModel}</Typography>
                    <Typography variant="body1">{carData.powerType}</Typography>
                    <Typography variant="body1">{carData.engineSize}</Typography>
                    <Typography variant="body1">{carData.licenseNumber}</Typography>
                </Grid>
            </Grid>
            <Grid container item xs={4} direction="column" alignItems="flex-end" style={{ paddingTop: 25, paddingRight: 10 }} >
                <Grid container item direction="row" justify="flex-end">
                    <Button onClick={() => handleEditButton("edit")} className={classes.defaultButton} style={{ marginRight: 10 }}>
                        {t('button_edit')}
                    </Button>
                    <Button onClick={handleWindowOpen} className={classes.defaultButton}>
                        {t('button_delete')}
                    </Button>
                </Grid>
                <Typography className={classes.infoText} variant="body1">
                    {infoText}
                </Typography>
            </Grid>

            <Dialog
                open={deleteWindowOpen}
            >
                <DialogTitle>{t('car_delete_question')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t('car_delete_note')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button className={classes.defaultButton} onClick={handleWindowYes}>{t('button_yes')}</Button>
                    <Button className={classes.defaultButton} onClick={handleWindowNo} autoFocus>{t('button_no')}</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default CarInfo;