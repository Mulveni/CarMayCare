import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showNavButtons } from '../actions';
import { useForm, Controller } from "react-hook-form";
import baseApiUrl from '../api_url.json';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
Grid,
Divider,
CardActions,
CardContent,
  Container,
  Button,
  TextField,
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  FormHelperText,
  Card,
  CardHeader
} from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  form: {
    width: 'fit-content', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    alignItems: 'center'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formGrid: {
    display: "flex", flexDirection: "column",
    maxWidth: 700,
    minWidth: 300,

    marginTop: 50,
    margin: 'auto'
  }
}));

const Profile = () => {

  const [errorText, setErrorText] = useState(null);
  const [submitText, setSubmitText] = useState(null);
  const defaultValue = {};
  const apiUrl = baseApiUrl.url;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(showNavButtons());
  }, [dispatch]);

  const classes = useStyles();
  const { register, errors, control, handleSubmit } = useForm({
    defaultValue,
    mode: "onBlur",
  });
  const onSubmit = data => {
    setSubmitText(null);
    setErrorText(null);
    axios.post(`${apiUrl}/register`, data, {
    })
      .then((response) => {
        setSubmitText(t("successfull_register"));
      }, (error) => {
        console.log(error.response.data);
        if (error.response.data.message === "E-mail already in use") {
          setErrorText(t('email_already_in_use'));
        }
        else if (error.response.status === 404) {
          setErrorText(t("internal_server_error"))
        }
      });
  };
  const onError = (errors, e) => {
    setErrorText(null);
    if (errors.email != null) {
      setErrorText(errors.email.message);
    }
    if (errors.email == null) {
      setErrorText(null);
    }
  }

  return (
    <div className={classes.formGrid}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Grid container item xs={12}>

          <Grid 
          className={classes.formGrid}
          container item xs={12} direction="row">
            <Card>
            <CardHeader
            title="Perustiedot"

            action={
          <Button size="small">Muokkaa</Button>
            }
            />
            <CardContent>
            <TextField
              name="brand"
              style={{ margin: 8 }}
              label={t('email')}
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
            </CardContent>
            </Card>
            </Grid>

          <Grid
           className={classes.formGrid}
           style={{ marginTop: 8 }}
           container xs={12} direction="row">
               
          <Card
          style={{ marginTop: 8 }}>
          <CardHeader
            title="Salasanan vaihto"
            action={
                <Button size="small">Vaihda salasana</Button>
                  }
        />
            <CardContent>
            <Typography variant="body1" component="p">
          Syötä salasana
            </Typography>
            <Typography variant="body1" component="p">
          Syötä salasan uudelleen
            </Typography>
            </CardContent>
            </Card>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={8}>
              <p>{errorText}</p>
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
export default Profile;