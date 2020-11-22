import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hideNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from "react-hook-form";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import baseApiUrl from '../api_url.json';
import axios from 'axios';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from'@material-ui/core/MenuItem';
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));



const Register = () => {

  const countries = [
    { value: "finland", text: "Finland" },
    { value: "sweden", text: "Sweden" },
    { value: "norway", text: "Norway" },
  ];
  const defaultValue = {};

    const apiUrl = baseApiUrl.url;

    const classes = useStyles();
    //const [countries, setCountry] = React.useState('');
    const { register, errors, control, handleSubmit, reset } = useForm({ 
      defaultValue,
      mode: "onBlur",
    });
    const [data, setData] = useState(null);
    const onSubmit = data => {

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
        <div className={classes.paper}>
          <Typography component="h6" variant="h6">
          {t('register')}
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit, onError)}>
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: true,
              pattern: {
                value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Invalid email address',
              },
              minLength: 2,
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
                required: true,
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
                required: true,
                minLength: 5,
              })}
              fullWidth
              name="phonenumber"
              label={t('phonenumber')}
              type="phonenumber"
              id="phonenumber"
            />
            {errors.phonenumber && "Phonenumber is required and must be 5 chars long"}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: true, 
                minLength: 2,
              })}
              fullWidth
              name="firstname"
              label={t('firstname')}
              type="etunimi"
              id="firstname"
            />
            {errors.firstname && "Firstname is required"}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: true,
                minLength: 2,
              })}
              fullWidth
              name="lastname"
              label={t('lastname')}
              type="sukunimi"
              id="lastname"
            />
            {errors.lastname && "Lastname is required"}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: true, 
                minLength: 2,
              })}
              fullWidth
              name="address.street"
              label={t('street')}
              type="osoite"
              id="street"
            />
            {errors.street && "Street is required"}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: true,
                minLength: 2,
              })}
              fullWidth
              name="address.city"
              label={t('city')}
              type="postinumero"
              id="city"
            />
            {errors.city && "City is required"}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: true,
                minLength: 2,
              })}
              fullWidth
              name="address.postcode"
              label={t('postcode')}
              type="postitoimipaikka"
              id="postcode"
            />
            {errors.postcode && "Postcode is required"}
              <FormControl>
                
              <Controller
              as={
                <Select>
                  <MenuItem value="finland">
                    {t('finland')}
                  </MenuItem>
                  <MenuItem value="sweden">
                  {t('sweden')}
                  </MenuItem>
                  <MenuItem value="norway">
                  {t('norway')}
                  </MenuItem>
                  <MenuItem value="denmark">
                  {t('denmark')}
                  </MenuItem>
                </Select>
              }
              name="address.country"
              margin="normal"
              rules={{ required: "this is required" }}
              control={control}
              fullWidth
              defaultValue=""
            />
              </FormControl>
            {errors.country && "Country is required"}
            <Button
              type="submit"
              fullWidth
              margin="normal"
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