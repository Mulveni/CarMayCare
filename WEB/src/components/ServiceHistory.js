import {ListItem, ListItemText, Divider, Paper, makeStyles, Typography} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import baseApiUrl from '../api_url.json';
import { useDispatch, useSelector } from 'react-redux';
import { showNavButtons } from '../actions';
import { background } from '../styles/classes';
import Colors from '../styles/colors';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({

    serviceButton: {
        backgroundColor:Colors.blue2,
        paddingbottom: 24,
        marginBottom: 5,

        '&:hover': {
            backgroundColor:Colors.orange_light,
            cursor: "pointer"
        }
    },

    background: background,

})

const ServiceHistory = (props) => {

    const history = useHistory();
    const classes = useStyles();
    const apiUrl = baseApiUrl.url;
    const myToken = useSelector(state => state.tokenReducer);
    const [services, setServices] = useState([]);
    const [errorText, setErrorText] = useState(null);

    var results = [];


    const getServices = () => {
        axios.defaults.headers.common = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${myToken}`
        }

        axios.get(`${apiUrl}/services/${props.carId}`,  {
        }).then((response) => {
            
            var i;
            for (i = 0; i < response.data.length; i++) {
                results.push(response.data[i]);
            }

            setServices(results);
        }, (error) => {
            console.log(error.response.data);
            console.log(error.response.status);

            if (error.response.data === "Unauthorized") {
                setErrorText(t('error') + ": " + t('unauthorized'));
                history.push("/");
            }
            else if (error.response.status === 404) {
                setErrorText(t('no_services_found_for_this_car'));
            }

        });
    }



    useEffect(getServices, []);

    const { t } = useTranslation();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showNavButtons());
    }, [dispatch]);

    if(errorText){

        return <div>
            <Typography variant="h5" align="center">
                {errorText}
            </Typography>

        </div>
    }


    return (
        <div>
        <Paper className={classes.background} alignContent="center" style={{ paddingTop: 25, paddingBottom: 25, margin: "auto"}}>

                {services.map(i => {
                    console.log(i.idCars)
                    return (
                        <Paper className={classes.background} key={i.idCars} alignContent="center" style={{marginLeft: 20, marginRight: 20}}>
                            <ListItem className={classes.serviceButton} style={{paddingTop: 25, paddingBottom: 25}} button onClick={() => {
                                console.log("Pressed the item, functionality to come later...");
                            }}>
                                <ListItemText
                                primary={i.description} style={{textAlign: "left", marginLeft: 20}}/>
                                <ListItemText
                                primary={i.dateOfService.substring(0,10)} style={{textAlign: "right", marginRight: 20}}/>

                            </ListItem>
                            <Divider variant="fullWidth"/>
                        </Paper>
                            )
                        })}
             </Paper>
        </div >
        
    )
}

export default ServiceHistory;