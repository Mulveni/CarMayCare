import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showNavButtons } from '../actions';
import { useForm, Controller } from "react-hook-form";
import baseApiUrl from '../api_url.json';
import axios from 'axios';
import { withRouter } from "react-router";
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { infoText, defaultButton, defaultLink, background } from '../styles/classes';
import Error from './Error';
import Loading from './Loading';
import {Grid,Divider,CardActions,CardContent,Container,Button,TextField,Typography,Select,FormControl,MenuItem,InputLabel,FormHelperText, Card,CardHeader } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  form: {
    width: 'fit-content', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    alignItems: 'center'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  profileGrid: {
    display: "flex", flexDirection: "column",
    maxWidth: 700,
    minWidth: 300,

    marginTop: 50,
    margin: 'auto'
  },
  background: background,
  defaultLink: defaultLink,
  defaultButton: defaultButton,
  infoText: infoText
}));

const Profile = (props) => {

  const [errorText, setErrorText] = useState(null);
  const [userData, setUserData] = useState({});
  const [serverError, setServerError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const defaultValue = {};
  const apiUrl = baseApiUrl.url;
  const apiToken = useSelector(state => state.tokenReducer);
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { register, errors, control, handleSubmit } = useForm({
    defaultValue,
    mode: "onBlur",
  });
  useEffect(() => {
      dispatch(showNavButtons());
  }, [dispatch]);

  /*const checkUserIdFromState = () => {
      if (props.location.state === undefined) {
          setServerError(true);
      } else {
          getUserInfo();
      }
  }
*/
  //const getUserInfo = () => {

useEffect(() => {
  axios
  .get(`${apiUrl}/user`, {
    headers: {
      Authorization: `Bearer ${apiToken}`
  }
  }).then(response => {
      if (response.data.message === "No results with given id") {
        console.log(response.data);
          setServerError(true);
          setLoading(false);
      } else {
          setUserData(response.data);
          setLoading(false);
      }

  }).catch(error => {
      console.log(error);
      setServerError(true);
      setLoading(false);

  });
},[])

  if (serverError) {
      return <Error />;
  }

  if (isLoading) {
      return <Loading />;
  }

  const onSubmit = data => {
  }
  const onError = (errors, e) => {
    setErrorText(null);
    if (errors.email != null) {
      setErrorText(errors.email.message);
    }
    else if (errors.phonenumber != null) {
      setErrorText(errors.phonenumber.message);
    }
    else if (errors.firstname != null) {
      setErrorText(errors.firstname.message);
    }
    else if (errors.lastname != null) {
      setErrorText(errors.lastname.message);
    }

    else if (errors.address.street != null) {
      setErrorText(errors.address.street.message);
    }
    else if (errors.address.city != null) {
      setErrorText(errors.address.city.message);
    }
    else if (errors.address.postcode != null) {
      setErrorText(errors.address.postcode.message);
    }
    else if (errors.address.country != null) {
      setErrorText(errors.address.country.message);
    }
  }

  return (
    <div>
      <Card
       className={classes.background} style={{ marginTop: 50 }}>
        <Grid container xs={12} direction="column" justify="center" alignItems="center" style={{ paddingTop: 25 }}>
          <Typography variant="h5">
            {t('profile')}
          </Typography>
          <form className={classes.profileGrid} onSubmit={handleSubmit(onSubmit, onError)}>
          <CardHeader
            action={
          <Button size="small">{t('button_edit')}</Button>
            }
            />
              <Grid item direction="row" alignItems="center">
              <TextField
              variant="outlined"
              style={{ margin: 8 }}
              inputRef={register({
                required: true,
                pattern: {
                  value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: t('email_required'),
                },
                minLength: 2,
              })}
              label={userData.email}
              disabled
              name="email"
            /> 
              <TextField
              variant="outlined"
              style={{ margin: 8 }}
              inputRef={register({
                required: t('phonenumber_required'),
                minLength: 5,
              })}
              name="phonenumber"
              disabled
              label={userData.phonenumber}
            />
            <TextField
              variant="outlined"
              style={{ margin: 8 }}
              inputRef={register({
                required: t('firstname_required'),
                minLength: 2,
              })}
              name="firstname"
              disabled
              label={userData.firstname}
            />
            <TextField
              variant="outlined"
              style={{ margin: 8 }}
              inputRef={register({
                required: t('lastname_required'),
                minLength: 2,
              })}
              name="lastname"
              disabled
              label={userData.lastname}
            />
            <TextField
              variant="outlined"
              style={{ margin: 8 }}
              inputRef={register({
                required: true,
                minLength: { value: 2, message: t('street_required') }
              })}
              name="address.street"
              disabled
              label={userData.address.street}
            />

            <TextField
              variant="outlined"
              style={{ margin: 8 }}
              inputRef={register({
                required: true,
                minLength: { value: 2, message: t('city_required') }
              })}
              name="address.city"
              disabled
              label={userData.address.city}
            />

            <TextField
              variant="outlined"
              style={{ margin: 8 }}
              inputRef={register({
                required: true,
                minLength: { value: 2, message: t('postcode_required') }
              })}
              name="address?.postcode"
              disabled
              label={userData.address.postcode}

            />

            <FormControl
              variant="outlined"
              disabled
              style={{ margin: 8 }}
            >
              <InputLabel id="countries-label">
                {userData.address.country}
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
                rules={{ required: t('country_required'),}}
                control={control}
                defaultValue=""
              />
            </FormControl>
              </Grid>
            <Typography className={classes.infoText} variant="body1">
              {errorText}
            </Typography>
            <Button
              className={classes.defaultButton}
              style={{ margin: "auto", marginTop: 25 }}
              type="submit">
              {t('button_submit')}
            </Button>
          </form>
        </Grid>
      </Card>
    </div>
  )
}
export default Profile;