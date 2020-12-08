import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import { withRouter } from "react-router";
import { Grid, makeStyles, Card, Tab, AppBar, Tabs, Avatar } from '@material-ui/core';
import ServiceHistory from './ServiceHistory';
import AddService from '../components/AddService';
import Notes from '../components/Notes';
import axios from 'axios';
import baseApiUrl from '../api_url.json';
import { useSelector } from 'react-redux';
import Error from './Error';
import Loading from './Loading';
import { background } from '../styles/classes';
import Colors from '../styles/colors';
import CarInfo from '../components/CarInfo';
import CarEdit from '../components/CarEdit';
import { useHistory } from 'react-router-dom';

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
    background: background
});

const CarView = (props) => {
    const carId = props.location.state.carId;

    const [serverError, setServerError] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);
    const [carData, setCarData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [infoText, setInfoText] = useState(null);

    const classes = useStyles();
    const { t } = useTranslation();
    const history = useHistory();

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

    const handleEditButton = (status) => {
        if (status === "edit") {
            setEditMode(true);
        } else {
            history.push("/mycars");
        }
    }

    const handleSaveButton = (status) => {
        if (status === "submit") {
            setLoading(true);
            getCarInfo();
            setInfoText(t('saved'));
        } else {
            setInfoText(null);
        }

        setEditMode(false);
    }

    const CarTabs = () => {
        switch (tabIndex) {
            case 0:
                return (
                    <ServiceHistory />
                )
            case 1:
                return (
                    <AddService carId={carId} /> //serviceId={100}
                )
            case 2:
                return (
                    <Notes carId={carId} />
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
            <Card className={classes.background} style={{ marginTop: 25 }}>
                <Grid container >
                    <Grid container item xs={4} direction="column" alignItems="flex-end" style={{ paddingTop: 25 }} >
                        <Avatar className={classes.avatar}>{carData.brand.substring(0, 1)}</Avatar>
                    </Grid>
                    {!editMode ?
                        <CarInfo
                            data={carData}
                            text={infoText}
                            handleEditButton={handleEditButton}
                        />
                        :
                        <CarEdit
                            data={carData}
                            carId={props.location.state.carId}
                            handleSaveButton={handleSaveButton}
                        />
                    }
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