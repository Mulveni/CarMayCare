import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import baseApiUrl from "../api_url.json";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
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
  const [infoText, setInfoText] = useState(null);
  const apiUrl = baseApiUrl.url;
  const classes = useStyles();
  const history = useHistory();

  const { register, handleSubmit, reset } = useForm();
  const { t } = useTranslation();

  const onSubmit = (data) => {
    axios.post(`${apiUrl}/notes/${props.carId}`, data, {}).then(
      (response) => {
        setInfoText(t("note_saved"));
        reset();
      },
      (error) => {
        if (
          error.response.status === 404 &&
          error.response.data.message === "no results for given id"
        ) {
          setInfoText(t("error_note_id_not_found"));
        } else if (error.response.data === "Unauthorized") {
          history.push("/login", { error: t("unauthorized") });
        } else {
          setInfoText(t("internal_server_error"));
        }
      }
    );
  };
  const onError = (errors) => {
    const firstValue = errors[Object.keys(errors)[0]];
    setInfoText(firstValue.message);
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
            required: { value: true, message: t("empty_field") },
            maxLength: { value: 200, message: t("message_over_200") },
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
            onClick={handleSubmit(onSubmit, onError)}
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
