import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showNavButtons } from '../actions';
import { useSelector } from 'react-redux';
import axios from 'axios';
import baseApiUrl from '../api_url.json';

import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import tokenReducer from '../reducers/tokenReducer';

const apiUrl = baseApiUrl.url;


const AddCar = () => {

  //const isLoggedin = useSelector(state => state.loginReducer);
  //const isLoggedin = useSelector(state => state.token);
  //console.log(useSelector(state => state.tokenReducer));
  
  /*
  const header = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }*/

  const myToken = useSelector(state => state.tokenReducer);
  
  axios.defaults.headers.common = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'Authorization': `Bearer ${myToken}`}

  var data = {
    brand: 'Testi',
    model: 'Testityyppi',
    yearModel: '1900',
    powerType: 'sähkö',
    engineSize: 'pieni',
    licenseNumber: 'ABC-123'
}
console.log(data);
  axios.post(`${apiUrl}/cars`, data, {
    }).then((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    }); 

    const { t } = useTranslation();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showNavButtons());
    }, []);

    return (
        <div style={{margin: 'auto', maxWidth: 650 }}>

            <Grid container item xs={12}>            

                <Grid container item xs ={12} direction = "row">  
                    <TextField
                    id="tf-brand"
                    style={{ margin: 8 }}
                    placeholder={t('car_brand')}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    />
                
                    <TextField
                    id="tf-model"
                    style={{ margin: 8}}
                    placeholder={t('car_model')}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    />

                    <TextField
                    id="tf-yearmodel"
                    style={{ margin: 8}}
                    placeholder={t('car_yearmodel')}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    />

                </Grid>

                <Grid container item xs={12} direction="row">

                    <TextField
                    id="tf-powertype"
                    style={{ margin: 8 }}
                    placeholder={t('car_powertype')}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    />

                    <TextField
                    id="tf-enginesize"
                    style={{ margin: 8 }}
                    placeholder={t('car_enginesize')}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    />

                </Grid>

                <Grid container item xs ={12} direction = "row"> 
                    <TextField
                    id="tf-license"
                    style={{ margin: 8 }}
                    placeholder={t('car_license')}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    />
                    <Button variant = "outlined"  onClick={() => {/* */}}>Send</Button>

                </Grid>

            </Grid>

        </div>
      
        )
}

export default AddCar;