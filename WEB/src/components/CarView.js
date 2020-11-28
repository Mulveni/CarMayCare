import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import { withRouter } from "react-router";
import { Grid, Button, makeStyles, Card, Tab, AppBar, Tabs, Avatar, Typography } from '@material-ui/core';
import ServiceHistory from './ServiceHistory';
import AddService from '../components/AddService';
import Notes from '../components/Notes';
import axios from 'axios';
import baseApiUrl from '../api_url.json';
import { useSelector } from 'react-redux';
import Error from './Error';
import Loading from './Loading';
import { defaultButton, background } from '../styles/classes';
import Colors from '../styles/colors';

const useStyles = makeStyles({
    tabView: {
        backgroundColor: Colors.blue1,
        color: "white"
    },
    indicatorColor: {
        backgroundColor: Colors.orange
    },
    tabActive: {
        color: "white",
        backgroundColor: Colors.orange
    },
    avatar: {
        backgroundColor: Colors.blue1,
        width: 75,
        height: 75
    },
    background: background,
    defaultButton: defaultButton
});

const CarView = (props) => {
    const [serverError, setServerError] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);
    const [carData, setCarData] = useState({});

    const classes = useStyles();
    const { t } = useTranslation();

    const apiUrl = baseApiUrl.url;
    const apiToken = useSelector(state => state.tokenReducer);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showNavButtons());
    }, [dispatch]);

    const checkCarIdFromState = () => {
        if (props.location.state === undefined) {
            setServerError(true);
        } else {
            getCarInfo();
        }
    }

    const getCarInfo = () => {
        axios.get(`${apiUrl}/cars/${props.location.state.carId}`, {
            headers: {
                Authorization: `Bearer ${apiToken}`
            }
        }).then(response => {
            if (response.data.message === "No results with given id") {
                setServerError(true);
                setLoading(false);
            } else {
                setCarData(response.data[0]);
                setLoading(false);
            }

        }).catch(error => {
            console.log(error);
            setServerError(true);
            setLoading(false);

        });
    }
    useEffect(checkCarIdFromState, []);

    const handleTabIndex = (event, index) => {
        setTabIndex(index);
    };

    const CarTabs = () => {
        switch (tabIndex) {
            case 0:
                return (
                    <ServiceHistory />
                )
            case 1:
                return (
                    <AddService />
                )
            case 2:
                return (
                    <Notes />
                )
            default:
                return (
                    <div>
                        <Error />
                    </div>
                )
        }
    }

    if (serverError) {
        return <Error />;
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <Card className={classes.background} style={{ marginTop: 50 }}>
                <Grid container >
                    <Grid container item xs={4} direction="column" alignItems="flex-end" style={{ paddingTop: 25 }} >
                        <Avatar className={classes.avatar}>{carData.brand.substring(0, 1)}</Avatar>
                    </Grid>
                    <Grid container item xs={4} justify="center" alignItems="center" style={{ paddingTop: 25, paddingBottom: 25 }} >
                        <Grid item>
                            <Typography variant="body1">{t('car_brand')}:</Typography>
                            <Typography variant="body1">{t('car_model')}:</Typography>
                            <Typography variant="body1">{t('car_yearmodel')}:</Typography>
                            <Typography variant="body1">{t('car_powertype')}:</Typography>
                            <Typography variant="body1">{t('car_enginesize')}:</Typography>
                            <Typography variant="body1">{t('car_license')}:</Typography>
                        </Grid>
                        <Grid item style={{ marginLeft: 10 }}>
                            <Typography variant="body1">{carData.brand}</Typography>
                            <Typography variant="body1">{carData.model}</Typography>
                            <Typography variant="body1">{carData.yearModel}</Typography>
                            <Typography variant="body1">{carData.powerType}</Typography>
                            <Typography variant="body1">{carData.engineSize}</Typography>
                            <Typography variant="body1">{carData.licenseNumber}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs={4} direction="column" alignItems="flex-end" style={{ paddingTop: 25, paddingRight: 10 }} >
                        <Button className={classes.defaultButton}>
                            {t('button_edit')}
                        </Button>
                    </Grid>
                </Grid>
            </Card>

            <Card className={classes.background}>

                <AppBar position="static" color="default">
                    <Tabs centered value={tabIndex} onChange={handleTabIndex}
                        className={classes.tabView}
                        classes={{ indicator: classes.indicatorColor }}
                    >
                        <Tab label={t('button_service_history')} className={tabIndex === 0 ? classes.tabActive : null} />
                        <Tab label={t('button_add_service')} className={tabIndex === 1 ? classes.tabActive : null} />
                        <Tab label={t('button_notes')} className={tabIndex === 2 ? classes.tabActive : null} />
                    </Tabs>
                </AppBar>

                <CarTabs />
            </Card>
        </div>
    )
}

export default withRouter(CarView);