import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hideNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from "react-hook-form";
import baseApiUrl from '../api_url.json';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
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

    const [errorText, setErrorText] = useState(null);
    const [submitText, setSubmitText] = useState(null);
    const defaultValue = {};
    const apiUrl = baseApiUrl.url;

    const classes = useStyles();
    const { register, errors, control, handleSubmit } = useForm({ 
      defaultValue,
      mode: "onBlur",
    });    
    const { t } = useTranslation();
    const dispatch = useDispatch();
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
          setErrorText(t('email_required'));
        } else{
          setErrorText(null);
        }
        });
    };
    const onError = (errors, e) => {
      setErrorText(null);
      if(errors.email != null){
        setErrorText(errors.email.message);
      }
      if(errors.email == null){
        setErrorText(null);
      }
    }


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
            <p>{errorText}</p>
            <TextField
              variant="outlined"
              margin="normal"
              inputRef={register({
                required: true,
                minLength: 5,
              })}
              fullWidth
              id="password"
              type="password"
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
            {errors?.address?.street && <p>{t('street_required')}</p>}
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
            {errors?.address?.city && <p>{t('city_required')}</p>}
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
            {errors?.address?.postcode && <p>{t('postcode_required')}</p>}
              <FormControl
              variant="outlined"
              margin="normal"
              fullWidth
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
              rules={{ required: true }}
              control={control}
              fullWidth
              defaultValue=""
            />
              {errors?.address?.country && <p>{t('country_required')}</p>}
              <FormHelperText>
              {errors?.address?.country && errors?.address?.country.message}
            </FormHelperText>
              </FormControl>

            <Button
              type="submit"
              fullWidth
              margin="normal"
              variant="contained"
              color="primary"
            >
              {t('submit')}
            </Button>
            <p>{submitText}</p>
            <Link className={classes.link} to="/login" >{t('login')}</Link>
          </form>
        </div>
      </Container>
    );
  }
export default Register;