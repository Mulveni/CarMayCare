import React, { useEffect } from 'react';
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
import baseApiUrl from '../api_url.json';
import Axios from 'axios';

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
    const apiUrl = baseApiUrl;

    const [countries, setCountry] = React.useState('Maa');
    const handleChange = (event) => {
    setCountry(event.target.value);
    };
  
    const classes = useStyles();
    const { register, handleSubmit, errors, setError, control } = useForm();
    
    const onSubmit = async data => {
      if (errors !== null) {
        Axios
        .post(`${apiUrl}/register`, data)
        .then(res => console.log(res))
        .catch(err => console.log(err));
      } 
    };
  
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
          <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
              required: "required", 
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
              name="street"
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
              name="city"
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
              name="postcode"
              label={t('postcode')}
              type="postitoimipaikka"
              id="postcode"
            />
            {errors.postitoimipaikka && "Post office is required"}

            <Select
              labelId="countries-label"
              id="countries-select"
              variant="outlined"
              fullWidth
              
              value={countries}
              onChange={handleChange}
        >
          <MenuItem value={1}>Finland</MenuItem>
          <MenuItem value={2}>Sweden</MenuItem>
          <MenuItem value={3}>Norway</MenuItem>
          <MenuItem value={4}>Denmark</MenuItem>
        </Select>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Submit
            </Button>
          </form>
        </div>
      </Container>
    );
  }
export default Register;