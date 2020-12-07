import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { showNavButtons } from "../actions";
import { useForm, Controller } from "react-hook-form";
import baseApiUrl from "../api_url.json";
import axios from "axios";
import { withRouter } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  infoText,
  defaultButton,
  defaultLink,
  background,
} from "../styles/classes";
import Error from "./Error";
import Loading from "./Loading";
//import Colors from "../styles/colors";
import {
  Grid,
  Button,
  TextField,
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  FormHelperText,
  Card,
  CardHeader,
} from "@material-ui/core";

const useStyles = makeStyles({
  defaultButton: defaultButton,
  background: background,
});
const ProfileEdit = ({ data, handleSave }) => {
  const [errorText, setErrorText] = useState(null);
  const [infoText, setInfoText] = useState(null);
  const userData = data;
  const { t } = useTranslation();
  const history = useHistory();
  const apiUrl = baseApiUrl.url;
  const apiToken = useSelector((state) => state.tokenReducer);
  const classes = useStyles();
  const defaultValue = {};

  const { register, errors, setValue, control, handleSubmit } = useForm({
    defaultValue,
    mode: "onBlur",
  });

  const handleCancel = () => {
    handleSave("cancel");
  };
  const onSubmit = (data) => {
    console.log(data);
    if (checkIfDataIsChanged(data) === false) {
      handleSave("submit");
    } else {
      axios
        .put(`${apiUrl}/user`, data, {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        })
        .then(() => {
          handleSave("submit");
        })
        .catch((error) => {
          console.log(error.response.data.message);
          if (error.response.data.message === "Email already in use.") {
            setInfoText(t("email_already_in_use"));
          } else if (
            error.response.status === 404 &&
            error.response.data.message === "no useid with given id"
          ) {
            console.log("ID not found");
            setInfoText(t("no user found"));
          } else if (error.response.data === "Unauthorized") {
            history.push("/login", { error: t("unauthorized") });
          } else {
            setInfoText(t("internal_server_error"));
          }
        });
    }
  };
  useEffect(() => {
    if (userData) {
      setValue("email", userData.email);
      setValue("phonenumber", userData.phonenumber);
      setValue("firstname", userData.firstname);
      setValue("lastname", userData.lastname);
      setValue("address.street", userData.address.street);
      setValue("address.city", userData.address.city);
      setValue("address.postcode", userData.address.postcode);
      setValue("address.country", userData.address.country);
    }
  }, [userData]);
  const checkIfDataIsChanged = (data) => {
    let dataChanged = false;
    for (const key in data) {
      if (data[key] !== userData[key]) {
        dataChanged = true;
      }
    }
    return dataChanged;
  };
  const onError = (errors, e) => {
    setInfoText(null);
    if (errors.email != null) {
      setInfoText(errors.email.message);
    } else if (errors.phonenumber != null) {
      setInfoText(errors.phonenumber.message);
    } else if (errors.firstname != null) {
      setInfoText(errors.firstname.message);
    } else if (errors.lastname != null) {
      setInfoText(errors.lastname.message);
    } else if (errors.address.street != null) {
      setInfoText(errors.address.street.message);
    } else if (errors.address.city != null) {
      setInfoText(errors.address.city.message);
    } else if (errors.address.postcode != null) {
      setInfoText(errors.address.postcode.message);
    } else if (errors.address.country != null) {
      setInfoText(errors.address.country.message);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          item
          xs={12}
          direction="row"
          alignItems="center"
          style={{ paddingTop: 25, paddingBottom: 25, margin: "auto" }}
        >
          <Grid item xs={10}>
            <TextField
              variant="outlined"
              style={{ margin: 8 }}
              inputRef={register({
                required: true,
                pattern: {
                  value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: t("email_required"),
                },
                minLength: 2,
              })}
              label={t("email")}
              name="email"
            />
            <TextField
              variant="outlined"
              style={{ margin: 8 }}
              inputRef={register({
                required: t("phonenumber_required"),
                minLength: 5,
              })}
              name="phonenumber"
              label={t("phonenumber")}
            />
            <TextField
              variant="outlined"
              style={{ margin: 8 }}
              inputRef={register({
                required: t("firstname_required"),
                minLength: 2,
              })}
              name="firstname"
              label={t("firstname")}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              style={{ margin: "auto" }}
              onClick={handleSubmit(onSubmit, onError)}
              className={classes.defaultButton}
            >
              {t("button_save")}
            </Button>
            <Button
              style={{ margin: "auto" }}
              onClick={handleCancel}
              className={classes.defaultButton}
            >
              {t("button_cancel")}
            </Button>
            <Typography className={classes.infoText} variant="body1">
              {errorText}
              {infoText}
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              variant="outlined"
              style={{ margin: 8 }}
              inputRef={register({
                required: t("lastname_required"),
                minLength: 2,
              })}
              name="lastname"
              label={t("lastname")}
            />
            <TextField
              variant="outlined"
              style={{ margin: 8 }}
              inputRef={register({
                required: true,
                minLength: { value: 2, message: t("street_required") },
              })}
              name="address.street"
              label={t("street")}
            />
            <TextField
              variant="outlined"
              style={{ margin: 8 }}
              inputRef={register({
                required: true,
                minLength: { value: 2, message: t("city_required") },
              })}
              label={t("city")}
              name="address.city"
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              variant="outlined"
              style={{ margin: 8 }}
              inputRef={register({
                required: true,
                minLength: { value: 2, message: t("postcode_required") },
              })}
              label={t("postcode")}
              name="address.postcode"
            />

            <FormControl variant="outlined" style={{ margin: 8 }}>
              <InputLabel id="countries-label">{t("country")}</InputLabel>
              <Controller
                style={{ background: background }}
                as={
                  <Select>
                    <MenuItem value="finland">{t("finland")}</MenuItem>
                    <MenuItem value="sweden">{t("sweden")}</MenuItem>
                    <MenuItem value="norway">{t("norway")}</MenuItem>
                    <MenuItem value="denmark">{t("denmark")}</MenuItem>
                  </Select>
                }
                defaultValue=""
                name="address.country"
                rules={{ required: t("country_required") }}
                control={control}
              />
            </FormControl>
          </Grid>

          <Grid
            container
            item
            xs={6}
            direction="column"
            alignItems="flex-end"
            style={{ paddingTop: 25, paddingRight: 10 }}
          ></Grid>
        </Grid>
      </form>
    </div>
  );
};
export default ProfileEdit;
