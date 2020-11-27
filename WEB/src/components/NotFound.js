import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, makeStyles, Link, Typography, Card } from '@material-ui/core';
import { hideNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import { defaultLink, background } from '../styles/classes';

const useStyles = makeStyles({
    background: background,
    defaulLink: defaultLink
});

const NotFound = () => {
    const { t } = useTranslation();
    const classes = useStyles();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideNavButtons());
    }, [dispatch]);

    return (
        <div>
            <Card className={classes.background} style={{ marginTop: 50 }}>
                <Grid container xs={12} direction="column" justify="center" alignItems="center" style={{ paddingTop: 25 }}>
                    <Typography variant="h5">
                        {t('page_not_found')}
                    </Typography>
                    <Link className={classes.defaultLink} style={{ marginBottom: 50, marginTop: 25 }} href="/" >{t('back_to_main_page')}</Link>
                </Grid>
            </Card>
        </div >
    )
}

export default NotFound;