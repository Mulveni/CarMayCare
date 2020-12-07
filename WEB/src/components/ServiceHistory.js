import { List, Grid, CardHeader, Button, Card, CardContent, ListItem, ListItemText, Divider, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import baseApiUrl from '../api_url.json';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsBackupRestoreSharp } from '@material-ui/icons';
import { showNavButtons } from '../actions';

const ServiceHistory = (props) => {

    const history = useHistory();
    const apiUrl = baseApiUrl.url;
    const myToken = useSelector(state => state.tokenReducer);
    const [services, setServices] = useState([]);
    const [errorText, setErrorText] = useState(null);
    var results = [];
    let individualService = false;


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
            }
            else if (error.response.status === 404) {
                setErrorText(t('error') + ": " + t('internal_server_error'));
            }

        });
    }

    useEffect(getServices, []);

    const { t } = useTranslation();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showNavButtons());
    }, [dispatch]);

    return (
        <div>
            <Paper>

                {services.map(i => {
                    console.log(i.idCars)
                    return (
                        <Paper key={i.idCars}>
                            <ListItem button onClick={() => {
                                history.push("/CarView/", {carId: i.idCars});
                                individualService = true}}>
                            <ListItemText

                                primary={i.description + " " + i.dateOfService.substring(0, 10)}
                            />

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