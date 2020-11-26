import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import { withRouter } from "react-router";
import { Grid, Button, makeStyles, Card, Tab, AppBar, Tabs, Avatar } from '@material-ui/core';
import ServiceHistory from './ServiceHistory';
import AddService from '../components/AddService';
import Notes from '../components/Notes';
import axios from 'axios';
import baseApiUrl from '../api_url.json';
import { useSelector } from 'react-redux';
import Error from './Error';
import Loading from './Loading';

const useStyles = makeStyles({
    carViewGrid: {
        display: "flex",
        flexDirection: "column",
        maxWidth: 800,
        minWidth: 600
    },
    carViewCard: {
        display: "flex",
        flexDirection: "row",
        padding: 25,
        background: "#D9E8F5"
    },
    editButton: {
        color: "white",
        backgroundColor: "#304269",
        '&:hover': {
            backgroundColor: "#F26101"
        }
    },
    tabView: {
        backgroundColor: "#304269",
        color: "white"
    },
    indicatorColor: {
        backgroundColor: "#F26101"
    },
    tabActive: {
        color: "white",
        backgroundColor: "#F26101"
    },
    avatar: {
        backgroundColor: "#304269",
        width: 75,
        height: 75
    }
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
            <Grid container direction="column" alignItems="center" style={{ marginTop: 50 }}>
                <div className={classes.carViewGrid}>
                    <Card>
                        <div className={classes.carViewCard}>
                            <Grid item md={1}>
                                <Avatar className={classes.avatar}>{carData.brand.substring(0, 1)}</Avatar>
                            </Grid>
                            <Grid container justify="center">
                                <Grid item>
                                    <p>{t('car_brand')}:</p>
                                    <p>{t('car_model')}:</p>
                                    <p>{t('car_yearmodel')}:</p>
                                    <p>{t('car_powertype')}:</p>
                                    <p>{t('car_enginesize')}:</p>
                                    <p>{t('car_license')}:</p>
                                </Grid>
                                <Grid item style={{ marginLeft: 10 }}>
                                    <p>{carData.brand}</p>
                                    <p>{carData.model}</p>
                                    <p>{carData.yearModel}</p>
                                    <p>{carData.powerType}</p>
                                    <p>{carData.engineSize}</p>
                                    <p>{carData.licenseNumber}</p>
                                </Grid>
                            </Grid>
                            <Grid item md={1} style={{ marginRight: 20 }}>
                                <Button className={classes.editButton}>
                                    {t('button_edit')}
                                </Button>
                            </Grid>
                        </div>
                    </Card>
                </div>
                <div className={classes.carViewGrid}>
                    <Card>

                        <AppBar position="static" color="default">
                            <Tabs value={tabIndex} onChange={handleTabIndex}
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
            </Grid>
        </div >

    )
}

export default withRouter(CarView);