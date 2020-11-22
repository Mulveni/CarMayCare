import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from "react-hook-form";
import baseApiUrl from '../api_url.json';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
Container,
Button,
TextField, 
Typography, 
Select, 
FormControl, 
MenuItem, 
InputLabel,
FormHelperText
} from "@material-ui/core";

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

    const defaultValue = {};
    const history = useHistory();
    const apiUrl = baseApiUrl.url;

    const classes = useStyles();
    //const [countries, setCountry] = React.useState('');
    const { register, errors, control, handleSubmit, reset } = useForm({ 
      defaultValue,
      mode: "onBlur",
    });    
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const onSubmit = data => {

      axios.post(`${apiUrl}/register`, data, {
      })
      .then((response) => {
        console.log(response);
        history.push("/");
        alert("Account successfully registered");
        }, (error) => {
        console.log(error.response.data);
        if (error.response.data = {"message":"E-mail already in use"}) {
          alert("Email already in use");
        }});
    };
    const onError = (errors, e) => console.log(errors, e);

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
                message: t('email_required'),
              },
              minLength: 2,
              })}
              fullWidth
              label={t('email')}
              name="email"
            />
            {errors.email && <p>{t('email_required')}</p>}
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
            />
            {errors.password && <p>{t('password_required')}</p>}
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
            />
            {errors.phonenumber && <p>{t('phonenumber_required')}</p>}
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
            />
            {errors.firstname && <p>{t('firstname_required')}</p>}
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
            />
            {errors.lastname && <p>{t('lastname_required')}</p>}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: true, 
                minLength: {value: 2,message:t('street_required') }
              })}
              fullWidth
              name="address.street"
              label={t('street')}
            />
            {errors.address && <p>{t('street_required')}</p>}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: true,
                minLength: {value: 2,message:t('city_required') }
              })}
              fullWidth
              name="address.city"
              label={t('city')}
            />
            {errors.address && <p>{t('city_required')}</p>}
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                
                required: true,
                minLength: {value: 2,message:t('postcode_required') }
              })}
              fullWidth
              name="address.postcode"
              label={t('postcode')}

            />
            {errors.address && <p>{t('postcode_required')}</p>}
              <FormControl
              variant="outlined"
              margin="normal"
              fullWidth
              helperText={Boolean(errors.address)}
              >
              <InputLabel id="countries-label">
              {t('country')}
            </InputLabel>
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
              rules={{ required: t('country_required') }}
              control={control}
              fullWidth
              defaultValue=""
            />
              <FormHelperText>
              {errors.address && <p>{t('country_required')}</p>}
            </FormHelperText>
              </FormControl>
              {errors.country && <p>{t('country_required')}</p>}
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