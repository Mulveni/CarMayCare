import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Colors from '../styles/colors';

const useStyles = makeStyles({
    loading: {
        color: Colors.orange
    }
});

const Loading = () => {
    const classes = useStyles();

    return (
        <div>
            <Grid container justify="center" style={{ marginTop: 50 }}>
                <CircularProgress size={300} className={classes.loading} />
            </Grid>

        </div >
    )
}

export default Loading;