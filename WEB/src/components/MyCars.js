import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'

import axios from 'axios';
import baseApiUrl from '../api_url.json';

import { defaultButton, background } from '../styles/classes';
import Colors from '../styles/colors';
import { Avatar, Grid, Button, Divider, makeStyles, Card, CardHeader, CardContent, 
        ListItem, ListItemText, ListItemAvatar, Box, Paper} from '@material-ui/core';

import Loading from './Loading';

// TODO:
// -    implement styles
// -    error message needs to update on language change.


const useStyles = makeStyles({ 

    indicatorColor: {
        backgroundColor: Colors.orange
    },

    carButton:{
        backgroundColor:Colors.blue2,
        paddingbottom: 24,
        marginBottom: 5,

        '&:hover': {
            backgroundColor:Colors.orange_light,
            cursor: "pointer",
            "& $avatar": {
                backgroundColor: Colors.orange
            } 
        }
    },

    avatar: {
        backgroundColor: Colors.blue1,
        width: 50,
        height: 50,
        margin: 10
    },

    background: background,
    defaultButton: defaultButton

});


const MyCars = () => {
    const history = useHistory();
    const classes = useStyles();
    const apiUrl = baseApiUrl.url;
    const myToken = useSelector(state => state.tokenReducer);
    const [cars, setCars] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState(null);
    var results = [];
    
    const getCars = () => {
        axios.defaults.headers.common = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'Authorization': `Bearer ${myToken}`
          }

        axios.get(`${apiUrl}/cars`, {
        }).then((response) => {
    
            var i;
            for (i = 0; i < response.data.length; i++) {
                results.push(response.data[i]);
            } 

            setCars(results);
            setLoading(false);
    
        }, (error) => {
            console.log(error.response.data);
            console.log(error.response.status);
    
            if (error.response.data === "Unauthorized") {
                setErrorText(t('error') + ": " +t('unauthorized'));
                setLoading(false);
            }
            else {
                setErrorText(t('error') + ": " +t('internal_server_error'))
                setLoading(false);
            }
        });

    }

    useEffect(getCars,[]);

    const { t } = useTranslation();
    
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showNavButtons());
    }, [dispatch]);
    

    if (isLoading) {
        return <Loading />;
    }

    return (
      
    <Card className={classes.background} style={{ marginTop: 50}}>           
            
        <CardHeader
        style={{ paddingTop: 25}}
        titleTypographyProps={{ variant: "h5", align: "center" }}
        title={t('menu_own_cars')}
        subheaderTypographyProps={{ variant: "body1"}}
        subheader={errorText}
        action={<Button className={classes.defaultButton} size="small" variant="outlined" onClick={() => { history.push("/AddCar"); }}>{t('car_addcar')}</Button>}
        />

        <Grid container item xs={12} direction="column" alignContent="center"  style={{ paddingTop: 25, paddingBottom: 25, margin: 'auto'}}>
            <CardContent>
                {cars.map(i => {
                    return (
                        <Paper elevation={1} key={i.idCars} className={classes.carButton} onClick={() => { history.push("/CarView/", {carId: i.idCars})}}>
                            <ListItem>
                                <ListItemAvatar> 
                                    <Avatar className={classes.avatar}>{i.brand.substring(0, 1)}</Avatar>
                                </ListItemAvatar>                           
                                <ListItemText
                                    primaryTypographyProps={{ variant: "h6"}}
                                    primary={i.brand + " " + i.model} 
                                
                                    secondaryTypographyProps={{component:"span", variant: "body1"}}
                                    secondary={
                                        
                                        <Grid container item xs={12} direction="row">
                                            <Grid item xs={6}>{t('car_yearmodel') + ": "}</Grid>
                                            <Grid item xs={6}>{i.yearModel}</Grid>
                                            <Grid item xs={6}>{t('car_license') + ": "}</Grid>
                                            <Grid item xs={6}>{i.licenseNumber}</Grid>
                                        </Grid>            
                                    }
                                />
                            </ListItem>
                        </Paper>);
                })}
            </CardContent>
        </Grid>
    </Card>
    )
}

export default MyCars;