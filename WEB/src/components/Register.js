import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hideNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from "react-hook-form";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import baseApiUrl from '../api_url.json';
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const emailIsUnique = async (email: string) => {
  await sleep(1000);
  return email !== "someone@somewhere.com";
};

const Register = () => {

 
  const apiUrl = baseApiUrl.url;
    const [countries, setCountry]= useState("");

    const classes = useStyles();
    const { register, errors, handleSubmit } = useForm({
      mode: "onBlur",
    });
    const onSubmit = data => {
      alert(JSON.stringify(data));

      axios.post(`${apiUrl}/register`, data, {
      })
      .then((response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      });
    };
    const onError = (errors, e) => console.log(errors, e);
    const { t } = useTranslation();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideNavButtons());
    }, []);

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit, onError)}>
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
              required: "required", 
              pattern: {
                value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Invalid email address',
              },
              minLength: 2,
              validate: emailIsUnique
              })}
              fullWidth

              id="email"
              label={t('email')}
              name="email"
              autoFocus
            />
            {errors.email && "Email is not in correct form or is already in use"}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: "required", 
                minLength: 5,
              })}
              fullWidth
              name="password"
              label={t('password')}
              type="password"
              id="password"
            />
            {errors.password && "Password is required and must be 5 chars long"}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: "required", 
                minLength: 5,
              })}
              fullWidth
              name="phonenumber"
              label={t('phonenumber')}
              type="phonenumber"
              id="phonenumber"
            />
            {errors.phonenumber && "phonenumber is required and must be 5 chars long"}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: "required", 
                minLength: 2,
              })}
              fullWidth
              name="firstname"
              label={t('firstname')}
              type="etunimi"
              id="firstname"
            />
            {errors.etunimi && "Firstname is required"}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: "required", 
                minLength: 2,
              })}
              fullWidth
              name="lastname"
              label={t('lastname')}
              type="sukunimi"
              id="lastname"
            />
            {errors.sukunimi && "Lastname is required"}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: "required", 
                minLength: 2,
              })}
              fullWidth
              name="address.street"
              label={t('street')}
              type="osoite"
              id="street"
            />
            {errors.osoite && "Address is required"}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: "required", 
                minLength: 2,
              })}
              fullWidth
              name="address.city"
              label={t('city')}
              type="postinumero"
              id="city"
            />
            {errors.postinumero && "Postcode is required"}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: "required", 
                minLength: 2,
              })}
              fullWidth
              name="address.postcode"
              label={t('postcode')}
              type="postitoimipaikka"
              id="postcode"
            />
            {errors.postitoimipaikka && "Post office is required"}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: "required", 
                minLength: 2,
              })}
              fullWidth
              name="address.country"
              label={t('country')}
              type="country"
              id="country"
            />
            {errors.country && "Country is required"}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              {t('submit')}
            </Button>
          </form>
        </div>
      </Container>
    );
  }
export default Register;