import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import baseApiUrl from "../api_url.json";
import { useDispatch } from "react-redux";
import { showNavButtons } from "../actions";
import { useForm } from "react-hook-form";
import {
  TextField,
  Typography,
  Grid,
  Button,
  makeStyles,
} from "@material-ui/core";
import { infoText, defaultButton, background } from "../styles/classes";

const useStyles = makeStyles({
  addNoteGrid: {
    display: "flex",
    flexDirection: "column",
    marginTop: 5,
    marginBottom: 5,
  },
  background: background,
  defaultButton: defaultButton,
  infoText: infoText,
});
const Notes = (props) => {
  const [setErrorText] = useState(null);
  const [infoText, setInfoText] = useState(null);
  const apiUrl = baseApiUrl.url;
  const classes = useStyles();
  const { register, handleSubmit, reset } = useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showNavButtons());
  }, [dispatch]);

  const onSubmit = (data) => {
    axios.post(`${apiUrl}/notes/${props.carId}`, data, {}).then(
      (response) => {
        setInfoText("note_saved");
        reset();
      },
      (error) => {
        console.log(error.response.data);
        console.log(error.response.status);
        if (error.response.data === "Unauthorized") {
          setErrorText(t("unauthorized"));
        } else if (error.response.status === 404) {
          setErrorText(t("internal_server_error"));
        } else {
          setErrorText(t("unknown_reason"));
        }
      }
    );
  };
  return (
    <form className={classes.addNoteGrid}>
      <Grid
        container
        item
        xs={8}
        direction="column"
        justify="center"
        alignItems="center"
        style={{ paddingTop: 25, margin: "auto" }}
      >
        <TextField
          name="note"
          placeholder={t("write_note_here")}
          fullWidth
          inputRef={register({
            required: true,
            minLength: 1,
            maxLength: 100,
          })}
          margin="normal"
          variant="outlined"
          multiline
          rows={3}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Grid container item direction="column" justify="center">
          <Typography
            style={{ margin: "auto", marginTop: 25 }}
            className={classes.infoText}
            variant="body1"
          >
            {infoText}
          </Typography>
          <Button
            style={{ margin: "auto", marginTop: 25 }}
            onClick={handleSubmit(onSubmit)}
            className={classes.defaultButton}
          >
            {t("button_save")}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default Notes;
