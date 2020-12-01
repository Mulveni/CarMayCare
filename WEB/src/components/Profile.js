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
import ProfileInfo from "../components/ProfileInfo";
import ProfileEdit from "../components/ProfileEdit";
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
  CardHeader,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "fit-content", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    alignItems: "center",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  profileGrid: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 700,
    minWidth: 300,

    marginTop: 50,
    margin: "auto",
  },
  background: background,
  defaultLink: defaultLink,
  defaultButton: defaultButton,
  infoText: infoText,
}));

const Profile = (props) => {
  const [errorText, setErrorText] = useState(null);
  const [userData, setUserData] = useState({});
  const [serverError, setServerError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const defaultValue = {};
  const apiUrl = baseApiUrl.url;
  const apiToken = useSelector((state) => state.tokenReducer);
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
          Authorization: `Bearer ${apiToken}`,
        },
      })
      .then((response) => {
        if (response.data.message === "No results with given id") {
          console.log(response.data);
          setServerError(true);
          setLoading(false);
        } else {
          setUserData(response.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setServerError(true);
        setLoading(false);
      });
  }, []);

  const handleEdit = useCallback(
    (event) => {
      event.preventDefault();
      setEditMode(true);
      console.log("handle edit");
    },
    [editMode]
  );

  const handleSave = useCallback(
    (event) => {
      event.preventDefault();
      setEditMode(false);
      console.log("handle save");
    },
    [editMode]
  );

  if (serverError) {
    return <Error />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Card className={classes.background} style={{ marginTop: 50 }}>
        <Grid container>
          <Grid
            container
            item
            xs={4}
            direction="row"
            alignItems="flex-end"
            style={{ paddingTop: 25 }}
          ></Grid>
          {!editMode ? (
            <ProfileInfo data={userData} handleEdit={handleEdit} />
          ) : (
            <ProfileEdit data={userData} handleSave={handleSave} />
          )}
        </Grid>
      </Card>
      <Card className={classes.background} style={{ marginTop: 5 }}>
        <Typography
          justify="center"
          className={classes.background}
          style={{ marginTop: 5 }}
          variant="h5"
        >
          {t("Change password")}
        </Typography>
        <Grid
          container
          item
          xs={12}
          direction="column"
          justify="center"
          alignItems="center"
          style={{ paddingTop: 5, paddingBottom: 5 }}
        >
          <Grid item xs={6}>
            <Typography
              style={{ marginTop: 15 }}
              className={classes.background}
              variant="body1"
            >
              {t("syötä salasana")}
            </Typography>
            <Typography className={classes.background} variant="body1">
              {t("syötä salasana uudelleen")}
            </Typography>
          </Grid>
          <Grid container item xs={6} direction="column" alignItems="center">
            <TextField
              variant="outlined"
              inputRef={register({
                required: true,
                minLength: 5,
              })}
              id="password"
              type="password"
              name="password"
              label={t("password")}
            />
            <TextField
              variant="outlined"
              inputRef={register({
                required: true,
                minLength: 5,
              })}
              id="password"
              type="password"
              name="password"
              label={t("password")}
            />
            {errors.password && (
              <Typography className={classes.infoText} variant="body1">
                {t("password_required")}
              </Typography>
            )}
            <Button
              justify="center"
              className={classes.defaultButton}
              type="submit"
              style={{ marginTop: 0 }}
            >
              {t("submit")}
            </Button>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};
export default Profile;
