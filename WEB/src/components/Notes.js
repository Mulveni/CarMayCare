import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, makeStyles, Card, Typography, Button, CardContent, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { background, defaultButton, infoText } from '../styles/classes';
import Colors from '../styles/colors';
import baseApiUrl from '../api_url.json';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loading from './Loading';
import Error from './Error';
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

const Notes = (data) => {
    const [currentNoteIndex, setCurrentNoteIndex] = useState(null);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [notesData, setNotesData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [serverError, setServerError] = useState(false);
    const [notesNotFound, setNotesNotFound] = useState(false);
    const [deleteNoteWindow, setDeleteNoteWindow] = useState(false);
    const [infoText, setInfoText] = useState(null);

    const { t } = useTranslation();
    const classes = useStyles();
    const history = useHistory();

    const apiUrl = baseApiUrl.url;
    const apiToken = useSelector(state => state.tokenReducer);

    const getNotes = () => {
        axios.get(`${apiUrl}/notes/${data.carId}`, {
            headers: {
                Authorization: `Bearer ${apiToken}`
            }
        }).then(response => {
            setNotesData(response.data);
            if (response.data.length < 1) {
                setNotesNotFound(true);
            }
            setLoading(false);
        }).catch(error => {
            console.log(error);
            setServerError(true);
            setLoading(false);
        });
    }

    useEffect(getNotes, []);

    const onMouseEnter = (e) => {
        setCurrentNoteIndex(parseInt(e.target.id, 10));
    }

    const onMouseLeave = () => {
        setCurrentNoteIndex(null);
    }

    const handleDelete = (noteId) => {
        setDeleteNoteWindow(true);
        setNoteToDelete(parseInt(noteId, 10));

    }

    const handleWindowYes = () => {
        setInfoText(null);
        axios.delete(`${apiUrl}/notes/${noteToDelete}`, {
            headers: {
                Authorization: `Bearer ${apiToken}`
            }
        }).then(() => {
            setLoading(true);
            getNotes();
        }).catch(error => {
            if (error.response.status === 404 && error.response.data.message === "no results for given id") {
                setInfoText(t('error_note_id_not_found'));
            }
            else if (error.response.data === "Unauthorized") {
                history.push("/login", { error: t('unauthorized') });
            } else {
                setServerError(true);
            }
        });
        setDeleteNoteWindow(false);
    }

    const handleWindowNo = () => {
        setDeleteNoteWindow(false);
    }

    if (serverError) {
        return <Error />;
    }

    if (isLoading) {
        return <Loading />;
    }

    if (notesNotFound) {
        return (
            <div>

                <Grid container direction="column" justify="center" alignItems="center" style={{ paddingTop: 25, paddingBottom: 25 }}>
                    <Typography variant="h5">
                        {t('no_notes_added')}
                    </Typography>
                </Grid>

            </div >
        )
    }

    return (
        <div>
            <Card className={classes.background}>
                <CardContent>
                    {notesData.map(note => {
                        return (
                            <Paper id={note.idNotes} key={note.idNotes} className={classes.noteBackground} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                                <Grid container>
                                    <Grid container item xs={3} direction="column" alignItems="flex-end" />
                                    <Grid container item xs={6} direction="column" justify="center" alignItems="center" style={{ overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto" }}>
                                        <Typography variant="body1">
                                            {note.note}
                                        </Typography>
                                    </Grid>
                                    <Grid container item xs={3} direction="column" alignItems="flex-end">
                                        <Grid container item direction="row" justify="flex-end">
                                            <Button className={classes.defaultButton} style={{ marginRight: 10, visibility: currentNoteIndex === note.idNotes ? "visible" : "hidden" }} >
                                                {t('button_edit')}
                                            </Button>
                                            <Button className={classes.defaultButton} onClick={() => handleDelete(note.idNotes)} style={{ visibility: currentNoteIndex === note.idNotes ? "visible" : "hidden" }} >
                                                {t('button_delete')}
                                            </Button>
                                        </Grid>
                                        <Typography className={classes.infoText} variant="body1" style={{ visibility: noteToDelete === note.idNotes ? "visible" : "hidden" }}>
                                            {infoText}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )
                    })}
                </CardContent>
            </Card>

            <Dialog
                open={deleteNoteWindow}
            >
                <DialogTitle>{t('note_delete_question')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t('note_delete_note')}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button className={classes.defaultButton} onClick={handleWindowYes}>{t('button_yes')}</Button>
                    <Button className={classes.defaultButton} onClick={handleWindowNo} autoFocus>{t('button_no')}</Button>

                </DialogActions>
            </Dialog>
        </div >
    )
}

export default Notes;