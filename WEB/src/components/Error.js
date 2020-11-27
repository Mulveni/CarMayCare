import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, makeStyles, Link, Typography } from '@material-ui/core';
import { defaultLink } from '../styles/classes';

const useStyles = makeStyles({
    defaulLink: defaultLink
});

const Error = () => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <div>
            <Grid container justify="center" direction="column" alignItems="center" style={{ marginTop: 50 }}>
                <Typography variant="h5">
                    {t('internal_server_error')}
                </Typography>
                <Link className={classes.defaultLink} href="/login" >{t('try_to_login')}</Link>
            </Grid>
        </div >
    )
}

export default Error;