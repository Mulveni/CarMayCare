import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showNavButtons } from '../actions';
import { useHistory } from 'react-router-dom'

import { useSelector } from 'react-redux';
import axios from 'axios';
import baseApiUrl from '../api_url.json';

import { useForm } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const AddCar = () => {
  const apiUrl = baseApiUrl.url;
  const history = useHistory();
  const { register, handleSubmit, watch, errors } = useForm();

  const onSubmit = data => {
    axios.post(`${apiUrl}/cars`, data, {
    }).then((response) => {
      
      console.log(response);
      history.push("/mycars");

    }, (error) => {

      console.log(error);

    }); 
  };
  const myToken = useSelector(state => state.tokenReducer);
  
  axios.defaults.headers.common = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    'Authorization': `Bearer ${myToken}`}

    const { t } = useTranslation();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showNavButtons());
    }, []);

    return (
        <div style={{margin: 'auto', maxWidth: "xs" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container item xs={12}>            

                <Grid container item xs ={12} direction = "row">  
                    <TextField
                    name="brand"
                    style={{ margin: 8 }}
                    placeholder={t('car_brand')}
                    inputRef={register({
                      required: "required", 
                      minLength: 1,
                    })}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    />
                
                    <TextField
                    name="model"
                    style={{ margin: 8}}
                    placeholder={t('car_model')}
                    inputRef={register({
                      required: "required", 
                      minLength: 1,
                    })}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    />

                    <TextField
                    name="yearModel"
                    style={{ margin: 8}}
                    placeholder={t('car_yearmodel')}
                    inputRef={register({
                      required: "required", 
                      minLength: 4,
                      maxLength: 4,
                      min: '1900',
                      max: '2100',
                      pattern: {
                        value: /[0-9]/,
                        message: 'Invalid email address',
                      }
                    })}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    />

                </Grid>

                <Grid container item xs={12} direction="row">

                    <TextField
                    name="powerType"
                    style={{ margin: 8 }}
                    placeholder={t('car_powertype')}
                    inputRef={register({
                      required: "required", 
                      minLength: 1,
                    })}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    />

                    <TextField
                    name="engineSize"
                    style={{ margin: 8 }}
                    placeholder={t('car_enginesize')}
                    inputRef={register({
                      required: "required", 
                      minLength: 1,
                    })}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    />

                </Grid>

                <Grid container item xs ={12} direction = "row"> 
                    <TextField
                    name="licenseNumber"
                    style={{ margin: 8 }}
                    placeholder={t('car_license')}
                    inputRef={register({
                      required: "required", 
                      minLength: 1,
                    })}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    />
                    <Button 
                    variant = "outlined"   
                    type="submit">Send</Button>

                </Grid>

            </Grid>
          </form>
        </div>
      
        )
}

export default AddCar;