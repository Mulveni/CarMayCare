import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import { Grid, Button, makeStyles, Card, CardMedia, Tab, AppBar, Tabs } from '@material-ui/core';
import CarImage from '../images/car_placeholder.PNG';
import MaintenanceHistory from '../components/MaintenanceHistory';
import AddService from '../components/AddService';
import Notes from '../components/Notes';
import axios from 'axios';
import baseApiUrl from '../api_url.json';
import { useSelector } from 'react-redux';
import Error from './Error';
import Loading from './Loading';
import NotFound from './NotFound';

const useStyles = makeStyles({
    carViewGrid: {
        display: "flex",
        flexDirection: "column",
        maxWidth: 800,
        minWidth: 600
    },
    image: {
        width: 150,
        height: 100
    },
    carViewCard: {
        display: "flex",
        padding: 10
    },
    carText: {
        paddingLeft: 50
    },
    editButton: {
        float: "right",
        padding: 10,
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
    }
});

const CarView = (props) => {
    const [serverError, setServerError] = useState(false);
    const [notFound, setNotFound] = useState(false);
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
        if (props.location.state.carId === undefined) {
            setServerError(true);
        }
    }

    const getCarInfo = () => {
        axios.get(`${apiUrl}/cars/${props.location.state.carId}`, {
            headers: {
                Authorization: `Bearer ${apiToken}`
            }
        }).then(response => {
            if (response.data.message === "No results with given id") {
                console.log("NO RESULTS");
                setNotFound(true);
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
    useEffect(getCarInfo, []);

    const handleTabIndex = (event, index) => {
        setTabIndex(index);
    };

    const CarTabs = () => {
        switch (tabIndex) {
            case 0:
                return (
                    <MaintenanceHistory />
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

    if (notFound) {
        return <NotFound />;
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div>
            <Grid container direction="column" alignItems="center" style={{ marginTop: 50 }}>

                <div className={classes.carViewGrid}>
                    <Card>
                        <div className={classes.editButton}>
                            <Button className={classes.tabActive}
                                variant="contained"
                            >
                                {t('edit')}
                            </Button>
                        </div>
                        <div className={classes.carViewCard}>
                            <CardMedia
                                className={classes.image}
                                image={CarImage}
                                title="Car Placeholder"
                            />
                            <div className={classes.carText}>
                                <p>{t('car_brand')}: {carData.brand}</p>
                                <p>{t('car_model')}: {carData.model}</p>
                                <p>{t('car_yearmodel')}: {carData.yearModel}</p>
                                <p>{t('car_powertype')}: {carData.powerType}</p>
                                <p>{t('car_enginesize')}: {carData.engineSize}</p>
                                <p>{t('car_license')}: {carData.licenseNumber}</p>
                            </div>

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

export default CarView;