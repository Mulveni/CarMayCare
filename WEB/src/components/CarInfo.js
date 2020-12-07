import React, { useState } from 'react';
import { Grid, Typography, Button, makeStyles, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { defaultButton, infoText } from '../styles/classes';

const useStyles = makeStyles({
    defaultButton: defaultButton,
    infoText: infoText
});

const CarInfo = ({ data, text, handleEditButton }) => {
    const [infoText] = useState(text);
    const [deleteWindowOpen, setDeleteWindowOpen] = useState(false);
    const carData = data;
    const { t } = useTranslation();
    const classes = useStyles();

    const handleWindowOpen = () => {
        setDeleteWindowOpen(true);
    };

    const handleWindowYes = () => {
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
                    <Button onClick={handleEditButton} className={classes.defaultButton} style={{ marginRight: 10 }}>
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