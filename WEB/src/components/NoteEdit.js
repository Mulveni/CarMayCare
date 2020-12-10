import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, makeStyles, Typography, Button, Paper, TextField } from '@material-ui/core';
import { background, defaultButton, infoText } from '../styles/classes';
import Colors from '../styles/colors';
import { useForm } from "react-hook-form";
import baseApiUrl from '../api_url.json';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
    noteBackground: {
        backgroundColor: Colors.blue2,
        padding: 25,
        marginBottom: 25,
        '&:hover': {
            backgroundColor: Colors.orange_light
        }
    },
    background: background,
    defaultButton: defaultButton,
    infoText: infoText
});

const NoteEdit = ({ note, handleEditButton }) => {
    const [infoText, setInfoText] = useState(null);

    const { t } = useTranslation();
    const classes = useStyles();
    const { register, handleSubmit } = useForm();
    const history = useHistory();

    const apiUrl = baseApiUrl.url;
    const apiToken = useSelector(state => state.tokenReducer);

    const handleCancel = () => {
        handleEditButton("cancel");
    }

    const onSubmit = (data) => {
        if (checkIfDataIsChanged(data) === false) {
            handleEditButton("submit", note.idNotes);
        } else {
            axios.put(`${apiUrl}/notes/${note.idNotes}`, data, {
                headers: {
                    Authorization: `Bearer ${apiToken}`
                }
            }).then(() => {
                handleEditButton("submit", note.idNotes);
            }).catch(error => {
                if (error.response.status === 404 && error.response.data.message === "no results for given id") {
                    setInfoText(t('error_note_id_not_found'));
                }
                else if (error.response.data === "Unauthorized") {
                    history.push("/login", { error: t('unauthorized') });
                } else {
                    setInfoText(t('internal_server_error'));
                }
            });
        }
    }

    const onError = (errors) => {
        const firstValue = errors[Object.keys(errors)[0]];
        setInfoText(firstValue.message);
    }

    const checkIfDataIsChanged = (data) => {
        let dataChanged = false;
        for (const key in data) {
            if (data[key] !== note[key]) {
                dataChanged = true;
            }
        }
        return dataChanged;
    }

    return (
        <>
            <Paper id={note.idNotes} key={note.idNotes} className={classes.noteBackground}>
                <Grid container>
                    <Grid container item xs={8} direction="column" justify="center" alignItems="flex-start">
                        <TextField
                            name="note"
                            defaultValue={note.note}
                            fullWidth
                            inputRef={register({
                                required: { value: true, message: t('empty_field') },
                                maxLength: { value: 200, message: t('message_over_200') }
                            })}
                            margin="normal"
                            variant="outlined"
                            multiline
                            rows={3}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            style={{ background: "white" }}
                        />
                    </Grid>
                    <Grid container item xs={4} direction="column" alignItems="flex-end">
                        <Grid container item direction="row" justify="flex-end">
                            <Button className={classes.defaultButton} onClick={handleCancel} style={{ marginRight: 10 }} >
                                {t('button_cancel')}
                            </Button>
                            <Button className={classes.defaultButton} onClick={handleSubmit(onSubmit, onError)} >
                                {t('button_save')}
                            </Button>
                        </Grid>
                        <Typography className={classes.infoText} variant="body1" style={{ marginLeft: 5 }}>
                            {infoText}
                        </Typography>
                    </Grid>
                </Grid>

            </Paper>
        </>

    )
}

export default NoteEdit;