import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { showNavButtons } from '../actions';

import { useSelector } from 'react-redux';
import axios from 'axios';
import baseApiUrl from '../api_url.json';

import { useForm } from 'react-hook-form';
import { TextField, Grid, Button, makeStyles } from '@material-ui/core';

// Onnistuneen lähetyksen jälkeen viesti käyttäjälle ennen siirtymää takaisin omat autot näkymään

const useStyles = makeStyles({
  formGrid: {
    display: "flex", flexDirection: "column",
    maxWidth: 700,
    minWidth: 300,

    marginTop: 50,
    margin: 'auto'
  },
  button: {
    display: "flex", flexDirection: "column",
    marginTop: 8,
    margin: 'auto',
    color: "white",
    backgroundColor: "#304269",
    '&:hover': {
      backgroundColor: "#F26101"
    }
  },
  infoText: {
    color: "white",
    backgroundColor: "#F26101",
    borderRadius: 10,
    paddingLeft: 10
  }
});

const AddCar = () => {
  const [errorText, setErrorText] = useState(null);
  const apiUrl = baseApiUrl.url;
  const history = useHistory();
  const classes = useStyles();
  const { register, handleSubmit } = useForm();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showNavButtons());
  }, [dispatch]);

  const onSubmit = data => {
    axios.post(`${apiUrl}/cars`, data, {
    }).then((response) => {

      console.log(response);
      history.push("/mycars");

    }, (error) => {
      console.log(error.response.data);
      console.log(error.response.status);
      if (error.response.data === "Unauthorized") {
        setErrorText(t('unauthorized'));
      }
      else if (error.response.status === 404) {
        setErrorText(t('internal_server_error'))
      }
      else {
        setErrorText(t('unknown_reason'));
      }

    });
  };

  const onError = (errors, e) => {
    setErrorText(null);
    if (errors.brand != null) {
      setErrorText(errors.brand.message);
    }
    else if (errors.model != null) {
      setErrorText(errors.model.message);
    }
    else if (errors.yearModel != null) {
      setErrorText(errors.yearModel.message);
    }
    else if (errors.powerType != null) {
      setErrorText(errors.powerType.message);
    }
    else if (errors.engineSize != null) {
      setErrorText(errors.engineSize.message);
    }
    else if (errors.licenseNumber != null) {
      setErrorText(errors.licenseNumber.message);
    }
  }

  const myToken = useSelector(state => state.tokenReducer);
  axios.defaults.headers.common = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'Authorization': `Bearer ${myToken}`
  }

  const { t } = useTranslation();

  return (
    <div className={classes.formGrid}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Grid container item xs={12}>

          <Grid container item xs={12} direction="row">

            <h1>{t('car_addcar')}</h1>

          </Grid>

          <Grid container item xs={12} direction="row">
            <TextField
              name="brand"
              style={{ margin: 8 }}
              placeholder={t('car_brand')}
              inputRef={register({
                required: t('car_brand') + " " + t('error_required'),
                minLength: { value: 2, message: t('car_brand') + " " + t('error_shorter') + " 2 " + t('error_characters') }
              })}
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              name="model"
              style={{ margin: 8 }}
              placeholder={t('car_model')}
              inputRef={register({
                required: t('car_model') + " " + t('error_required'),
                minLength: { value: 2, message: t('car_model') + " " + t('error_shorter') + " 2 " + t('error_characters') }
              })}
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              name="yearModel"
              style={{ margin: 8 }}
              placeholder={t('car_yearmodel')}
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
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid container item xs={12} direction="row">

            <TextField
              name="powerType"
              style={{ margin: 8 }}
              placeholder={t('car_powertype')}
              inputRef={register({
                required: t('car_powertype') + " " + t('error_required'),
                minLength: { value: 2, message: t('car_powertype') + " " + t('error_shorter') + " 2 " + t('error_characters') }
              })}
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              name="engineSize"
              style={{ margin: 8 }}
              placeholder={t('car_enginesize')}
              inputRef={register({
                required: t('car_enginesize') + " " + t('error_required'),
                minLength: { value: 2, message: t('car_enginesize') + " " + t('error_shorter') + " 2 " + t('error_characters') }
              })}
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              name="licenseNumber"
              style={{ margin: 8 }}
              placeholder={t('car_license')}
              inputRef={register({
                required: t('car_license') + " " + t('error_required'),
                minLength: { value: 2, message: t('car_license') + " " + t('error_shorter') + " 2 " + t('error_characters') }
              })}
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />

          </Grid>

          <Grid container item xs={12}>

            <Grid item xs={8}>
              <p className={classes.infoText}>{errorText}</p>
            </Grid>

            <Grid item xs={4}>
              <Button
                className={classes.button}
                variant="outlined"
                type="submit">
                {t('button_submit')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>

  )
}

export default AddCar;