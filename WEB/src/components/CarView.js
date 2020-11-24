import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import { Grid, Button, makeStyles, Card, CardMedia, Tab, AppBar, Tabs } from '@material-ui/core';
import CarImage from '../images/car_placeholder.PNG';
import MaintenanceHistory from '../components/MaintenanceHistory';
import AddService from '../components/AddService';
import Notes from '../components/Notes';

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

const CarView = () => {
    const [tabIndex, setTabIndex] = useState(0);

    const classes = useStyles();

    const { t } = useTranslation();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showNavButtons());
    }, [dispatch]);

    const handleTabIndex = (event, index) => {
        setTabIndex(index);
    };

    const TestTab = () => {

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
                        Error
                    </div>
                )
        }
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
                                <p>{t('car_brand')}: TestBrand</p>
                                <p>{t('car_model')}: TestModel</p>
                                <p>{t('car_yearmodel')}: TestYearModel</p>
                                <p>{t('car_powertype')}: TestPowerType</p>
                                <p>{t('car_enginesize')}: TestEngineSize</p>
                                <p>{t('car_license')}: TestLicense</p>
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
                        <TestTab />
                    </Card>

                </div>


            </Grid>
        </div >
    )
}

export default CarView;