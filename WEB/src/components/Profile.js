import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { showNavButtons } from "../actions";
import { useForm } from "react-hook-form";
import baseApiUrl from "../api_url.json";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
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
  Button,
  TextField,
  Typography,
  Card,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  DialogContent,
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
  const [userData, setUserData] = useState({});
  const [userPassword, setUserPassword] = useState({});
  const [serverError, setServerError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [infoText, setInfoText] = useState(null);
  const [openDialog, setDialogOpen] = useState(false);
  const [openPasswordDialog, setDialogPasswordOpen] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState(false);
  const history = useHistory();
  const defaultValue = {};
  const apiUrl = baseApiUrl.url;
  const apiToken = useSelector((state) => state.tokenReducer);
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { register, errors, getValues, handleSubmit } = useForm({
    defaultValue,
    mode: "onBlur",
  });

  const {
    register: register2,
    errors: errors2,
    handleSubmit: handleSubmit2,
  } = useForm({
    mode: "onBlur",
  });
  let newPasswordData = null;

  const onSubmitCheckPassword = (data) => {
    console.log(data.passwordDelete);
    setUserPassword(data.passwordDelete);
    //console.log(userPassword);
    checkLogin(data.passwordDelete);
    newPasswordData = data.password;
    if (passwordCheck === true) {
      deleteUser();
      history.push("/login");
    } else {
      setDialogOpen(false);
    }
  };

  const onSubmit = (data) => {
    console.log({ password: data.password });
    setUserPassword(data.passwordOld);
    console.log(userPassword);
    checkLogin(data.passwordOld);
    newPasswordData = data.password;
    changePassword();
  };
  useEffect(() => {
    dispatch(showNavButtons());
  }, [dispatch]);

  function changePassword() {
    axios
      .put(
        `${apiUrl}/user/password`,
        { password: newPasswordData },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      )
      .then((response) => {
        if (response.data.message === "No results with given id") {
          console.log(response.data);
          setServerError(true);
          setLoading(false);
        } else {
          setUserPassword(response.data);
          setInfoText("Salasana vaihdettu onnistuneesti");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setServerError(true);
        setLoading(false);
      });
  }
  function deleteUser() {
    axios
      .delete(`${apiUrl}/user`, {
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
        if (error.response === undefined) {
          setInfoText(t("internal_server_error"));
        } else {
          if (error.response.data === "Unauthorized") {
            setInfoText(t("incorrect_login"));
          } else {
            setInfoText(t("internal_server_error"));
          }
        }
      });
  }
  function getUserInfo() {
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
  }
  const checkLogin = (data) => {
    axios
      .post(`${apiUrl}/login`, null, {
        auth: {
          username: userData.email,
          password: data,
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          setDialogPasswordOpen(true);
          setPasswordCheck(true);
        }
      })
      .catch((error) => {
        if (error.response === undefined) {
          setServerError(true);
          setLoading(false);
        } else {
          if (error.response.data === "Unauthorized") {
            setInfoText(t("incorrect_login"));
          } else {
            setInfoText(t("internal_server_error"));
          }
        }
      });
  };
  useEffect(() => {
    getUserInfo();
  }, [editMode]);

  const handleOnCloseDelete = () => {
    checkLogin();
    setDialogOpen(false);
  };
  function handleOnOpen() {
    setDialogOpen(true);
  }
  function handleOnClose() {
    setDialogOpen(false);
  }
  function handleOnClosePassword() {
    setDialogPasswordOpen(false);
  }
  function handleOnOpenPassword() {}
  const handleEdit = useCallback(() => {
    setEditMode(true);
  }, [editMode]);

  const handleSave = useCallback(
    (status) => {
      if (status === "submit") {
        getUserInfo();
      } else {
        setInfoText(null);
      }

      setEditMode(false);
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
        <form key={1} onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            item
            xs={12}
            direction="column"
            justify="center"
            alignItems="center"
            style={{ paddingTop: 5, paddingBottom: 5 }}
          >
            <Grid item xs={12}>
              <Typography
                justify="center"
                className={classes.background}
                style={{ marginTop: 5 }}
                variant="h5"
              >
                {t("Change password")}
              </Typography>
            </Grid>
            <Grid container item xs={6} direction="column" alignItems="center">
              <Typography
                style={{ marginTop: 15 }}
                className={classes.background}
                variant="body1"
              >
                {t("Enter old password")}
              </Typography>
              <TextField
                variant="outlined"
                inputRef={register({
                  required: true,
                  minLength: 5,
                })}
                id="password"
                type="password"
                name="passwordOld"
                label={t("password")}
              />
              <Typography className={classes.background} variant="body1">
                {t("enter new password")}
              </Typography>
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
              <Typography className={classes.background} variant="body1">
                {t("confirm password")}
              </Typography>
              <TextField
                variant="outlined"
                inputRef={register({
                  required: true,
                  minLength: 5,
                  validate: {
                    matchesPreviousPassword: (value) => {
                      const { password } = getValues();
                      return password === value || "Passwords should match!";
                    },
                  },
                })}
                id="password"
                type="password"
                name="passwordConfirmation"
                label={t("password")}
              />
              {errors.passwordConfirmation && (
                <Typography className={classes.infoText} variant="body1">
                  {t("salasanat ei täsmää")}
                </Typography>
              )}
              <Button
                justify="center"
                className={classes.defaultButton}
                type="submit"
                onClick={handleOnOpenPassword}
                style={{ marginTop: 5 }}
              >
                {t("submit")}
              </Button>
              <Dialog open={openPasswordDialog} onClose={handleOnClosePassword}>
                <DialogTitle id="alert-dialog-title">
                  {"Salasana vaihdettu"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {"Salasana vaihdettu onnistuneesti"}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleOnClosePassword}
                    color="primary"
                    autoFocus
                  >
                    {"Ok"}
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </form>
      </Card>
      <Card className={classes.background} style={{ marginTop: 5 }}>
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
              justify="center"
              className={classes.background}
              style={{ marginTop: 5 }}
              variant="h5"
            >
              {t("Poista käyttäjä")}
            </Typography>
          </Grid>
          <Grid container item xs={6} direction="column" alignItems="center">
            <Button
              justify="center"
              className={classes.defaultButton}
              onClick={handleOnOpen}
              style={{ marginTop: 5 }}
            >
              {t("Poista käyttäjä")}
            </Button>
            <Dialog open={openDialog} onClose={handleOnClose}>
              <DialogTitle id="alert-dialog-title">
                {"Käyttäjätilin poisto"}
              </DialogTitle>
              <DialogContent>
                <form key={2} onSubmit={handleSubmit2(onSubmitCheckPassword)}>
                  <DialogContentText id="alert-dialog-description">
                    {"Kirjoita salasana poistaaksesi käyttäjätili"}
                  </DialogContentText>
                  <TextField
                    variant="outlined"
                    inputRef={register2({
                      required: true,
                      minLength: 5,
                    })}
                    id="passwordDelete"
                    type="password"
                    name="passwordDelete"
                    label={t("password")}
                  />
                </form>
              </DialogContent>
              <DialogActions>
                <Button
                  type="submit"
                  onSubmit={onSubmitCheckPassword}
                  color="primary"
                >
                  {"Poista käyttäjä"}
                </Button>
                <Button onClick={handleOnClose} color="primary" autoFocus>
                  {"Peruuta"}
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};
export default Profile;
