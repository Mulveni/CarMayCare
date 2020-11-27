import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, makeStyles, Link, Typography, Card } from '@material-ui/core';
import { defaultLink, background } from '../styles/classes';

const useStyles = makeStyles({
    background: background,
    defaulLink: defaultLink
});

const Error = () => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <div>
            <Card className={classes.background} style={{ marginTop: 50 }}>
                <Grid container xs={12} direction="column" justify="center" alignItems="center" style={{ paddingTop: 25 }}>
                    <Typography variant="h5">
                        {t('internal_server_error')}
                    </Typography>
                    <Link className={classes.defaultLink} style={{ marginBottom: 50, marginTop: 25 }} href="/login" >{t('try_to_login')}</Link>
                </Grid>
            </Card>
        </div >
    )
}

export default Error;