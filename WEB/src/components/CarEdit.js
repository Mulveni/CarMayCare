import React from 'react';
import { Grid, TextField, makeStyles, Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { defaultButton } from '../styles/classes';

const useStyles = makeStyles({
    defaultButton: defaultButton
});

const CarEdit = ({ data, handleSave }) => {
    const carData = data;
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <>
            <Grid container item xs={4} justify="center" alignItems="center" style={{ paddingTop: 25, paddingBottom: 25 }} >
                <Grid container item justify="center">
                    <TextField
                        variant="outlined"
                        margin="normal"
                        id="car_brand"
                        label={t('car_brand')}
                        defaultValue={carData.brand}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        id="car_model"
                        label={t('car_model')}
                        defaultValue={carData.model}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        id="car_yearmodel"
                        label={t('car_yearmodel')}
                        defaultValue={carData.yearModel}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        id="car_powertype"
                        label={t('car_powertype')}
                        defaultValue={carData.powerType}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        id="car_enginesize"
                        label={t('car_enginesize')}
                        defaultValue={carData.engineSize}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        id="car_license"
                        label={t('car_license')}
                        defaultValue={carData.licenseNumber}
                    />
                </Grid>
            </Grid>
            <Grid container item xs={4} direction="column" alignItems="flex-end" style={{ paddingTop: 25, paddingRight: 10 }} >
                <Button onClick={handleSave} className={classes.defaultButton}>
                    {t('button_save')}
                </Button>
            </Grid>
        </>
    )
}

export default CarEdit;