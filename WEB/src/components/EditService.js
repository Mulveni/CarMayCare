import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import axios from 'axios';
import baseApiUrl from '../api_url.json';

import { useForm } from 'react-hook-form';
import { TextField, Grid, Button, makeStyles, Typography, Card, Checkbox, FormControl, 
         FormControlLabel, FormLabel, FormGroup, Dialog, DialogTitle, DialogContent, 
         DialogContentText, DialogActions} from '@material-ui/core';

import { infoText, defaultButton, background} from '../styles/classes';
import Loading from './Loading';

const useStyles = makeStyles({
    formGrid: {
      display: "flex",
      flexDirection: "column",
      marginTop: 25,
      marginBottom: 50
    },
    formControl: {
      margin: 10,
    },
    background: background,
    defaultButton: defaultButton,
    infoText: infoText
  });

const EditService = (props) => {
    const classes = useStyles();
    const apiUrl = baseApiUrl.url;
    const myToken = useSelector(state => state.tokenReducer);
    const [isLoading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState(null);
    const { register, handleSubmit } = useForm();
    const [fieldsDisabled, setFieldsDisabled] = useState(true);
    const [description, setDescription] = useState();
    const [mileAge, setMileAge] = useState();
    const [additionalInformation, setAdditionalInformation] = useState();
    const [deleteWindowOpen, setDeleteWindowOpen] = useState(false);

    const [motorOilChange, setMotorOilChange] = useState({
      mocDone: false,
      longLifeOilUsed: false
    });
    const [airConditioningService, setAirConditioningService] = useState({
      acsDone: false,
      dryer: false
    });
    const [additionalServices, setAdditionalServices] = useState({
      sparkPlugReplacement: false,
      airFilterReplacement: false,
      cleanAirReplacement: false,
      fuelFilterReplacement: false,
      brakeFluidReplacement: false,
      gearBoxOilReplacement: false,
      powerSteeringOilReplacement: false,
      timingBeltReplacement: false,
      waterPumpReplacement: false,
      dieselParticulateFilterReplacement: false
    });

    const { mocDone, longLifeOilUsed} = motorOilChange;
    const { acsDone, dryer} = airConditioningService;
    const {sparkPlugReplacement, airFilterReplacement, cleanAirReplacement, fuelFilterReplacement,
      brakeFluidReplacement, gearBoxOilReplacement, powerSteeringOilReplacement, timingBeltReplacement, 
      waterPumpReplacement, dieselParticulateFilterReplacement} = additionalServices;


    const getService = () => {
      axios.defaults.headers.common = {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'Authorization': `Bearer ${myToken}`
        }

      axios.get(`${apiUrl}/services/${props.carId}/${props.serviceId}`, {
      }).then((response) => {
        var responseAdditional, responseMotor, responseAir, key;
        responseAdditional = response.data[0].additionalServices;
        responseMotor = response.data[0].motorOilChange;
        responseAir= response.data[0].airConditioningService;

        setDescription(response.data[0].description);
        setMileAge(response.data[0].mileAge);
        setAdditionalInformation(response.data[0].additionalInformation);

          for (key in responseAdditional) {
            if(responseAdditional[key] === 1){
              additionalServices[key] = true;
            }
            else{
              additionalServices[key] = false;
            }
          }

          for (key in responseAir) {
            if(responseAir[key] === 1){
              if(key === "done"){
                airConditioningService.acsDone = true;
              }
              else{
                airConditioningService[key] = true;
              }
            }

            else{
              if(key === "done"){
                airConditioningService.acsDone = false;
              }
              else{
                airConditioningService[key] = false;
              }
            }
          }

          for (key in responseMotor) {
            if(responseMotor[key] === 1){
              if(key === "done"){
                motorOilChange.mocDone = true;
              }
              else{
                motorOilChange[key] = true;
              }
            }

            else{
              if(key === "done"){
                motorOilChange.mocDone = false;
              }
              else{
                motorOilChange[key] = false;
              }
            }
          }

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


    const handleWindowOpen = () => {
      setDeleteWindowOpen(true);
    };

    const handleWindowNo = () => {
      setDeleteWindowOpen(false);
  };

    const deleteService = () => {
      axios.defaults.headers.common = {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'Authorization': `Bearer ${myToken}`
        }

      axios.delete(`${apiUrl}/services/${props.carId}/${props.serviceId}`, {
      }).then((response) => {  
        props.goToService(0);
      }, (error) => {
          console.log(error.response.data);
          console.log(error.response.status);
  
          if (error.response.data === "Unauthorized") {
              setErrorText(t('error') + ": " +t('unauthorized'));
          }
          else {
              setErrorText(t('error') + ": " +t('internal_server_error'))
          }
      });

      setDeleteWindowOpen(false);

    }

    const onSubmit = data => {
      setFieldsDisabled(fieldsDisabled => !fieldsDisabled);
      setErrorText(null);

      if(motorOilChange.mocDone === false){
        motorOilChange.longLifeOilUsed = false;
      }

        axios.put(`${apiUrl}/services/${props.carId}/${props.serviceId}`, {

          description: data.description,
          mileAge: data.mileAge,
          additionalInformation: data.additionalInformation,

          additionalServices,

          motorOilChange:{
            done: motorOilChange.mocDone,
            longLifeOilUsed: motorOilChange.longLifeOilUsed
          },

          airConditioningService:{
            done: airConditioningService.acsDone,
            dryer: airConditioningService.dryer
          }

        }).then((response) => {

            console.log(response);
            setErrorText(t('service_edit'));

        }, (error) => {

            if (error.response.data === "Unauthorized") {
            setErrorText(t('unauthorized'));
            }

            else{
            setErrorText(t('internal_server_error'))
            }

        });
        };


        const onError = (errors, e) => {

          setErrorText(null);
          if (errors.description != null) {
            setErrorText(errors.description.message);
          }

          else if (errors.mileAge != null) {
            setErrorText(errors.mileAge.message);
          }

          else if (errors.additionalInformation != null) {
            setErrorText(errors.additionalInformation.message);
          }

        };

        const handleChange = (event) => {

          if(additionalServices.hasOwnProperty(event.target.name) === true){
            setAdditionalServices({ ...additionalServices, [event.target.name]: event.target.checked });
          }
          else if(motorOilChange.hasOwnProperty(event.target.name) === true){
            setMotorOilChange({ ...motorOilChange, [event.target.name]: event.target.checked });
          }
          else if(airConditioningService.hasOwnProperty(event.target.name) === true){
            setAirConditioningService({ ...airConditioningService, [event.target.name]: event.target.checked });
          }
          else{
            console.log(t('error') + "@handleChange")
          }

        };
        
        const checkboxDisabled = () => {
          if(fieldsDisabled === true || mocDone === false)
          {
            return true;
          }
          else
          {
            return false;
          }
        }

    useEffect(getService,[]);

    const { t } = useTranslation();

    if (isLoading) {
      return <Loading />;
    }

    

    return (
      <Card className={classes.background} style={{ marginTop: 10}}>
        <Grid container item xs={12} direction ="row">
          <Grid container item xs={6} direction="row" justify="flex-start" style={{ paddingTop: 25 }} >
            <Button
                onClick={() => { props.goToService(0); }}
                className={classes.defaultButton}
                style={{ marginTop: 25, marginLeft: 10}}>
                {t('button_back')}
              </Button>
          </Grid>
          <Grid container item xs={6} direction="row" justify="flex-end" style={{ paddingTop: 25 }} >
              <Button
                onClick={() => { setFieldsDisabled(fieldsDisabled => !fieldsDisabled) }}
                className={classes.defaultButton}
                style={{ marginTop: 25, marginRight: 10}}
                disabled={!fieldsDisabled}>
                {t('button_edit')}
              </Button>
              <Button 
                onClick={handleWindowOpen} 
                className={classes.defaultButton} 
                style={{ marginTop: 25, marginRight: 10}}
                disabled={!fieldsDisabled}>
                {t('button_delete')}
              </Button>
          </Grid>
        </Grid>
        <Grid container item xs={8} direction="column" justify="center" alignItems="center" style={{ paddingTop: 25, margin: 'auto'}}>
   
          <form className={classes.formGrid} onSubmit={handleSubmit(onSubmit, onError)}>

            <Typography className={classes.infoText} variant="body1">
              {errorText}
            </Typography>

            <TextField
                name="description"
                style={{ margin: 8 }}
                placeholder={t('service_description')}
                defaultValue = {description}
                disabled={fieldsDisabled}
                inputRef={register({
                  required: t('service_description') + " " + t('error_required'),
                  minLength: { value: 2, message: t('service_description') + " " + t('error_shorter') + " 2 " + t('error_characters') }
                })}
                margin="normal"
                variant="outlined"
                multiline
                rows={2}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                name="mileAge"
                style={{ margin: 8 }}
                placeholder={t('service_mileage')}
                defaultValue = {mileAge}
                disabled={fieldsDisabled}
                inputRef={register({
                  required: t('service_mileage') + " " + t('error_required'),
                  minLength: { value: 2, message: t('service_mileage') + " " + t('error_shorter') + " 2 " + t('error_characters') },
                  maxLength: { value: 6, message: t('service_mileage') + " " + t('error_longer') + " 6 " + t('error_characters') },
                  pattern: {
                    value: /[0-9]/,
                    message: t('service_mileage') +" "+ t('error_inputs') + " 0-9"
                  }
                })}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />


            <FormControl component="fieldset" className={classes.formControl}>
              

            <Grid container item xs={12} direction= "row">
              
              <Grid item xs={12}>
                <FormLabel component="legend"><Typography variant="h6" gutterBottom>{t('motor_oil_change')}</Typography></FormLabel>
              </Grid>

              <Grid item xs={6}>
                <FormGroup>
                <FormControlLabel
                  control={<Checkbox disabled={fieldsDisabled} checked={mocDone} onChange={handleChange} name="mocDone" />}
                  label={t('done')}
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={6}>
                <FormGroup>
                  <FormControlLabel
                  control={<Checkbox disabled={checkboxDisabled()} checked={longLifeOilUsed} onChange={handleChange} name="longLifeOilUsed" />}
                  label={t('long_life_oil_used')}
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <FormLabel component="legend"> <Typography variant="h6" gutterBottom> {t('air_conditioning_service')} </Typography></FormLabel>
              </Grid>

              <Grid item xs={6}>
                <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={acsDone} disabled={fieldsDisabled} onChange={handleChange} name="acsDone" />}
                  label={t('done')}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                control={<Checkbox checked={dryer} disabled={fieldsDisabled} onChange={handleChange} name="dryer" />}
                label={t('dryer')}
                />
              
              </Grid>

            
              <Grid item xs={12}>
                <FormLabel component="legend"><Typography variant="h6" gutterBottom>{t('additional_services')}</Typography></FormLabel>
              </Grid>

              <Grid item xs={6}>
                <FormGroup>
                  <FormControlLabel
                  control={<Checkbox checked={sparkPlugReplacement} disabled={fieldsDisabled} onChange={handleChange} name="sparkPlugReplacement" />}
                  label={t('sparkplug_replacement')}
                  />
                  <FormControlLabel
                  control={<Checkbox checked={airFilterReplacement} disabled={fieldsDisabled} onChange={handleChange} name="airFilterReplacement" />}
                  label={t('air_filter_replacement')}
                  />
                  <FormControlLabel
                  control={<Checkbox checked={cleanAirReplacement} disabled={fieldsDisabled} onChange={handleChange} name="cleanAirReplacement" />}
                  label={t('clean_air_replacement')}
                  />
                  <FormControlLabel
                  control={<Checkbox checked={fuelFilterReplacement} disabled={fieldsDisabled} onChange={handleChange} name="fuelFilterReplacement" />}
                  label={t('fuel_filter_replacement')}
                  />
                  <FormControlLabel
                  control={<Checkbox checked={brakeFluidReplacement} disabled={fieldsDisabled} onChange={handleChange} name="brakeFluidReplacement" />}
                  label={t('brake_fluid_replacement')}
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={6}>
                <FormGroup>
                    <FormControlLabel
                    control={<Checkbox checked={gearBoxOilReplacement} disabled={fieldsDisabled} onChange={handleChange} name="gearBoxOilReplacement" />}
                    label={t('gearbox_oil_replacement')}
                    />
                    <FormControlLabel
                    control={<Checkbox checked={powerSteeringOilReplacement} disabled={fieldsDisabled} onChange={handleChange} name="powerSteeringOilReplacement" />}
                    label={t('power_steering_oil_replacement')}
                    />
                    <FormControlLabel
                    control={<Checkbox checked={timingBeltReplacement} disabled={fieldsDisabled} onChange={handleChange} name="timingBeltReplacement" />}
                    label={t('timing_belt_replacement')}
                    />
                    <FormControlLabel
                    control={<Checkbox checked={waterPumpReplacement} disabled={fieldsDisabled} onChange={handleChange} name="waterPumpReplacement" />}
                    label={t('water_pump_replacement')}
                    />
                    <FormControlLabel
                    control={<Checkbox checked={dieselParticulateFilterReplacement} disabled={fieldsDisabled} onChange={handleChange} name="dieselParticulateFilterReplacement" />}
                    label={t('diesel_particulate_filter_replacement')}
                    />
                </FormGroup>
              </Grid>


            </Grid>
            </FormControl>


            <TextField
                name="additionalInformation"
                style={{ margin: 8 }}
                placeholder={t('service_additional_information')}
                defaultValue = {additionalInformation}
                disabled={fieldsDisabled}
                inputRef={register({
           
                  minLength: { value: 2, message: t('service_additional_information') + " " + t('error_shorter') + " 2 " + t('error_characters') }
                })}
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                InputLabelProps={{
                  shrink: true,
                }}
              />

            <Button
              className={classes.defaultButton}
              style={{ margin: "auto", marginTop: 25}}
              type="submit"
              disabled={fieldsDisabled}>
              {t('button_save')}
            </Button>
          </form>
        </Grid>

        <Dialog open={deleteWindowOpen}>
          <DialogTitle>{t('service_delete_question')}</DialogTitle>
          <DialogContent>
              <DialogContentText>{t('service_delete_note')}</DialogContentText>
          </DialogContent>
          <DialogActions>
              <Button className={classes.defaultButton} onClick={deleteService}>{t('button_yes')}</Button>
              <Button className={classes.defaultButton} onClick={handleWindowNo} autoFocus>{t('button_no')}</Button>
          </DialogActions>
        </Dialog>


      </Card>
    )
}

export default EditService;