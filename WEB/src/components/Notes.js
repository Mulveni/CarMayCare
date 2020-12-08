import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, makeStyles, Card, Typography, Button, CardContent, Paper } from '@material-ui/core';
import { background, defaultButton } from '../styles/classes';
import Colors from '../styles/colors';
import baseApiUrl from '../api_url.json';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loading from './Loading';
import Error from './Error';

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
    defaultButton: defaultButton
});

const Notes = (data) => {
    const [currentIndex, setCurrentIndex] = useState(null);
    const [notesData, setNotesData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [serverError, setServerError] = useState(false);
    const [notesNotFound, setNotesNotFound] = useState(false);
    const { t } = useTranslation();
    const classes = useStyles();

    const apiUrl = baseApiUrl.url;
    const apiToken = useSelector(state => state.tokenReducer);

    const getNotes = () => {
        axios.get(`${apiUrl}/notes/${data.carId}`, {
            headers: {
                Authorization: `Bearer ${apiToken}`
            }
        }).then(response => {
            console.log(response);
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

        setCurrentIndex(parseInt(e.target.id, 10));
    }

    const onMouseLeave = () => {

        setCurrentIndex(null);
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
                                            <Button className={classes.defaultButton} style={{ marginRight: 10, visibility: currentIndex === note.idNotes ? "visible" : "hidden" }} >
                                                {t('button_edit')}
                                            </Button>
                                            <Button className={classes.defaultButton} style={{ visibility: currentIndex === note.idNotes ? "visible" : "hidden" }} >
                                                {t('button_delete')}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )
                    })}
                </CardContent>


            </Card>
        </div >
    )
}

export default Notes;