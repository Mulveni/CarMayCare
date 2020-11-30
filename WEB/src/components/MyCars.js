import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'

import axios from 'axios';
import baseApiUrl from '../api_url.json';
import { Avatar, Grid, Button, Divider, makeStyles, Card, CardHeader, CardContent, 
        ListItem, ListItemText, ListItemAvatar} from '@material-ui/core';

// TODO:
// -    implement styles
// -    error message needs to update on language change.

/*
const useStyles = makeStyles({ 

    indicatorColor: {
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
*/

const MyCars = () => {
    const history = useHistory();
    const apiUrl = baseApiUrl.url;
    const myToken = useSelector(state => state.tokenReducer);
    const [cars, setCars] = useState([]);
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
    
        }, (error) => {
            console.log(error.response.data);
            console.log(error.response.status);
    
            if (error.response.data === "Unauthorized") {
                setErrorText(t('error') + ": " +t('unauthorized'));
            }
            else if (error.response.status === 404) {
                setErrorText(t('error') + ": " +t('internal_server_error'))
            }
            else {
                setErrorText(t('error') + ": " +t('unknown_reason'));
            }
        });

    }

    useEffect(getCars,[]);

    const { t } = useTranslation();
    
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showNavButtons());
    }, [dispatch]);
    

    return (
        <div>
            <Grid container item xs={12} direction="column" alignItems="center" style={{ paddingTop: 25, paddingBottom: 25, margin: 'auto'}}>
                <Card style={{ marginTop: 50}}>
                    
                    <CardHeader
                    titleTypographyProps={{ variant: "h5" }}
                    title={t('menu_own_cars')}
                    subheaderTypographyProps={{ variant: "body1"}}
                    subheader={errorText}
                    action={<Button size="small" variant="outlined" onClick={() => { history.push("/AddCar"); }}>{t('car_addcar')}</Button>}
                    />

                    <CardContent>

                        {cars.map(i => {
                            console.log(i.idCars)
                            return (
                                <Grid key={i.idCars}>
                                    <ListItem button onClick={() => { history.push("/CarView/", {carId: i.idCars}); }}>
                                    
                                    <ListItemAvatar> 
                                        <Avatar>{i.brand.substring(0, 1)}</Avatar>
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
                                    <Divider variant="fullWidth"/>
                                </Grid>
                            );
                        })}
                    </CardContent>
                </Card>
            </Grid>
        </div >
    )
}

export default MyCars;