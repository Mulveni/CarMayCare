import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    link: {
        display: "flex",
        justifyContent: "center",
        marginTop: 25
    }
});

const Error = () => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <div>
            <Grid container justify="center" direction="column" alignItems="center" style={{ marginTop: 50 }}>
                <h1>{t('internal_server_error')}</h1>
                <Link className={classes.link} to="/login" >{t('try_to_login')}</Link>
            </Grid>
        </div >
    )
}

export default Error;