import {ListItem, ListItemText, Paper, makeStyles, Typography, Grid} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import baseApiUrl from '../api_url.json';
import { useSelector } from 'react-redux';
import EditService from '../components/EditService';
import { background } from '../styles/classes';
import Colors from '../styles/colors';
import { useHistory } from 'react-router-dom';
import Loading from './Loading';

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
    const [currentServiceId, setCurrentServiceId] = useState(0);
    const [services, setServices] = useState([]);
    const [errorText, setErrorText] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setLoader] = useState(true);


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
            setLoader(false);

        }, (error) => {
            console.log(error.response.data);
            console.log(error.response.status);

            if (error.response.data === "Unauthorized") {
                setErrorText(t('error') + ": " + t('unauthorized'));
                setLoader(false);
                history.push("/");
            }
            else if (error.response.status === 404) {
                setErrorText(t('no_services_found_for_this_car'));
                setLoader(false);
            }

        });
    }

    useEffect(getServices, []);

    const { t } = useTranslation();

    const goToService = (id) => {
        if(id === 0){
            getServices();
        }

        setCurrentServiceId(id);
        setEditMode(editMode => !editMode);

    };

    if(errorText){

        return(
            <div>
                <Grid container direction="column" justify="center" alignItems="center" style={{paddingTop: 25, paddingBottom: 25}}>

                
                    <Typography variant="h5">

                        {errorText}
                        
                    </Typography>

                </Grid>
            </div>
        )
    }

  if(isLoading){
      return <Loading/>;
  }

   
    return (
        <div>
            {editMode ? (
                <EditService carId={props.carId} serviceId={currentServiceId} goToService={goToService}/>
            ) : (
                <Paper className={classes.background} align="center" style={{ paddingTop: 25, paddingBottom: 25, margin: "auto"}}>
                {services.map(i => {
                    return (
                       <Paper className={classes.background} key={i.idServices} style={{marginLeft: 20, marginRight: 20, width: "66.6%"}}>
                            <ListItem className={classes.serviceButton} style={{paddingTop: 25, paddingBottom: 25}} button onClick={() => {goToService(i.idServices)}}>

                                <ListItemText
                                primary={i.description} style={{textAlign: "left", marginLeft: 20}}/>
                                <ListItemText
                                primary={i.dateOfService.substring(0,10)} style={{textAlign: "right", marginRight: 20}}/>

                            </ListItem>
                        </Paper>
                    )
                })}
                </Paper>
            )}
        </div >      
    )
}

export default ServiceHistory;