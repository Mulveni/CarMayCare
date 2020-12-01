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
import {
  infoText,
  defaultButton,
  defaultLink,
  background,
} from "../styles/classes";
import Error from "./Error";
import Loading from "./Loading";
import Colors from "../styles/colors";
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
  const userData = data;
  const { t } = useTranslation();
  const classes = useStyles();
  const defaultValue = {};

  const { register, errors, control, handleSubmit } = useForm({
    defaultValue,
    mode: "onBlur",
  });

  const onSubmit = (data) => {};
  const onError = (errors, e) => {
    setErrorText(null);
    if (errors.email != null) {
      setErrorText(errors.email.message);
    } else if (errors.phonenumber != null) {
      setErrorText(errors.phonenumber.message);
    } else if (errors.firstname != null) {
      setErrorText(errors.firstname.message);
    } else if (errors.lastname != null) {
      setErrorText(errors.lastname.message);
    } else if (errors.address.street != null) {
      setErrorText(errors.address.street.message);
    } else if (errors.address.city != null) {
      setErrorText(errors.address.city.message);
    } else if (errors.address.postcode != null) {
      setErrorText(errors.address.postcode.message);
    } else if (errors.address.country != null) {
      setErrorText(errors.address.country.message);
    }
  };
  return (
    <div>
      <Grid
        container
        item
        xs={12}
        direction="row"
        alignItems="center"
        style={{ paddingTop: 25, paddingBottom: 25, margin: "auto" }}
      >
        <Grid item xs={12}>
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
            defaultValue={userData.email}
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
            defaultValue={userData.phonenumber}
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
            defaultValue={userData.firstname}
          />
          <TextField
            variant="outlined"
            style={{ margin: 8 }}
            inputRef={register({
              required: t("lastname_required"),
              minLength: 2,
            })}
            name="lastname"
            label={t("lastname")}
            defaultValue={userData.lastname}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            style={{ margin: 8 }}
            inputRef={register({
              required: true,
              minLength: { value: 2, message: t("street_required") },
            })}
            name="address.street"
            label={t("street")}
            defaultValue={userData.address.street}
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
            defaultValue={userData.address.city}
          />
          <TextField
            variant="outlined"
            style={{ margin: 8 }}
            inputRef={register({
              required: true,
              minLength: { value: 2, message: t("postcode_required") },
            })}
            label={t("postcode")}
            name="address?.postcode"
            defaultValue={userData.address.postcode}
          />

          <FormControl variant="outlined" style={{ margin: 8 }}>
            <InputLabel id="countries-label">{t("country")}</InputLabel>
            <Controller
              style={{ background: Colors.blue2 }}
              as={
                <Select>
                  <MenuItem value="finland">{t("finland")}</MenuItem>
                  <MenuItem value="sweden">{t("sweden")}</MenuItem>
                  <MenuItem value="norway">{t("norway")}</MenuItem>
                  <MenuItem value="denmark">{t("denmark")}</MenuItem>
                </Select>
              }
              name="address.country"
              rules={{ required: t("country_required") }}
              control={control}
              defaultValue={userData.address.country}
            />
          </FormControl>
        </Grid>
        <Typography className={classes.infoText} variant="body1">
          {errorText}
        </Typography>
        <Grid
          container
          item
          xs={6}
          direction="column"
          alignItems="flex-end"
          style={{ paddingTop: 25, paddingRight: 10 }}
        >
          <Button onClick={handleSave} className={classes.defaultButton}>
            {t("button_save")}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
export default ProfileEdit;
