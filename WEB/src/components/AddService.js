import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import baseApiUrl from '../api_url.json';
import { useForm } from 'react-hook-form';
import { TextField, Grid, Button, makeStyles, Typography, Card, Checkbox, FormControl, 
         FormControlLabel, FormLabel, FormGroup} from '@material-ui/core';
import { infoText, defaultButton, background} from '../styles/classes';

const useStyles = makeStyles({
    addService: {
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

const AddService = (props) => {
  console.log("Current car id: " + props.carId);
    const classes = useStyles();
    const apiUrl = baseApiUrl.url;
    const [errorText, setErrorText] = useState(null);
    const { register, handleSubmit } = useForm();

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

    const onSubmit = data => {
      setErrorText(null);
      if(motorOilChange.mocDone === false){
        motorOilChange.longLifeOilUsed = false;
      }

        axios.post(`${apiUrl}/services/${props.carId}`, {

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
            setErrorText(t('service_add'));

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

    const { t } = useTranslation();

    return (
      <Card className={classes.background} style={{ marginTop: 50}}>
        <Grid container item xs={8} direction="column" justify="center" alignItems="center" style={{ paddingTop: 25, margin: 'auto'}}>
   
          <form className={classes.addService} onSubmit={handleSubmit(onSubmit, onError)}>

            <Typography className={classes.infoText} variant="body1">
              {errorText}
            </Typography>

            <TextField
                name="description"
                style={{ margin: 8 }}
                placeholder={t('service_description')}
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
                control={<Checkbox checked={mocDone} onChange={handleChange} name="mocDone" />}
                label={t('done')}
                />
              </FormGroup>
              </Grid>

              <Grid item xs={6}>
              <FormGroup>
                <FormControlLabel
                control={<Checkbox disabled={!mocDone} checked={longLifeOilUsed} onChange={handleChange} name="longLifeOilUsed" />}
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
                control={<Checkbox checked={acsDone} onChange={handleChange} name="acsDone" />}
                label={t('done')}
                />
              </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                control={<Checkbox checked={dryer} onChange={handleChange} name="dryer" />}
                label={t('dryer')}
                />
              
              </Grid>

            
              <Grid item xs={12}>
              <FormLabel component="legend"><Typography variant="h6" gutterBottom>{t('additional_services')}</Typography></FormLabel>
              </Grid>

              <Grid item xs={6}>
              <FormGroup>
                <FormControlLabel
                control={<Checkbox checked={sparkPlugReplacement} onChange={handleChange} name="sparkPlugReplacement" />}
                label={t('sparkplug_replacement')}
                />
                <FormControlLabel
                control={<Checkbox checked={airFilterReplacement} onChange={handleChange} name="airFilterReplacement" />}
                label={t('air_filter_replacement')}
                />
                <FormControlLabel
                control={<Checkbox checked={cleanAirReplacement} onChange={handleChange} name="cleanAirReplacement" />}
                label={t('clean_air_replacement')}
                />
                <FormControlLabel
                control={<Checkbox checked={fuelFilterReplacement} onChange={handleChange} name="fuelFilterReplacement" />}
                label={t('fuel_filter_replacement')}
                />
                <FormControlLabel
                control={<Checkbox checked={brakeFluidReplacement} onChange={handleChange} name="brakeFluidReplacement" />}
                label={t('brake_fluid_replacement')}
                />
              </FormGroup>
              </Grid>

              <Grid item xs={6}>
                <FormGroup>
                    <FormControlLabel
                    control={<Checkbox checked={gearBoxOilReplacement} onChange={handleChange} name="gearBoxOilReplacement" />}
                    label={t('gearbox_oil_replacement')}
                    />
                    <FormControlLabel
                    control={<Checkbox checked={powerSteeringOilReplacement} onChange={handleChange} name="powerSteeringOilReplacement" />}
                    label={t('power_steering_oil_replacement')}
                    />
                    <FormControlLabel
                    control={<Checkbox checked={timingBeltReplacement} onChange={handleChange} name="timingBeltReplacement" />}
                    label={t('timing_belt_replacement')}
                    />
                    <FormControlLabel
                    control={<Checkbox checked={waterPumpReplacement} onChange={handleChange} name="waterPumpReplacement" />}
                    label={t('water_pump_replacement')}
                    />
                    <FormControlLabel
                    control={<Checkbox checked={dieselParticulateFilterReplacement} onChange={handleChange} name="dieselParticulateFilterReplacement" />}
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
              type="submit">
              {t('button_submit')}
            </Button>
          </form>
        </Grid>
      </Card>
    )
}

export default AddService;