import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from "@material-ui/core/Grid";

const currencies = [
    {
      value: 'Finland',
      label: 'FI',
    },
    {
      value: 'Sweden',
      label: 'SWE',
    },
    {
      value: 'Norway',
      label: 'NO',
    },
    {
      value: 'Denmark',
      label: 'DK',
    },
  ];

const useStyles = makeStyles({
    root: {
        '& .MuiTextField-root': {
          width: '25ch',
          marginTop: "50"
        },
    center:{
        marginLeft:"auto",
        marginRight:"auto"
        }
    },
  });

const Register = () => {
   
    const classes = useStyles();
    const [currency, setCurrency] = React.useState('EUR');

    const handleChange = (event) => {
        setCurrency(event.target.value);
      };

    const { t } = useTranslation();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideNavButtons());
    }, []);

    return (
      <div className={classes.root}> 
        <Grid container justify={"center"}>
        <form className={classes.root} noValidate autoComplete="off"> 
        <Grid>
        <TextField
          id="tf-email"
          label=""
          style={{ margin: 8 }}
          placeholder="Sähköpostiosoite"
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
        </Grid>
        <Grid>
        <TextField
          id="tf-password"
          label=""
          style={{ margin: 8 }}
          placeholder="Salasana"
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
        </Grid>
        <Grid>
        <TextField
          id="tf-email-again"
          label=""
          style={{ margin: 8 }}
          placeholder="Syötä salasana uudelleen"
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
        </Grid>

        <Grid>
        <TextField
          id="tf-firstname"
          label=""
          required
          style={{ margin: 8 }}
          placeholder="Etunimi"
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          />
          <TextField
          id="tf-lastname"
          label=""
          style={{ margin: 8 }}
          placeholder="Sukunimi"
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

        <Grid>
        <TextField
          id="tf-phonenumber"
          label=""
          style={{ margin: 8 }}
          placeholder="Puhelinnumero"
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
        </Grid>

        <Grid>        
        <TextField
          id="tf-country"
          select
          style={{ margin: 8 }}
          label="Select country"
          margin="normal"
          value={currency}
          onChange={handleChange}
          variant="outlined"
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        </Grid>

        <Grid>
        <TextField
          id="tf-address"
          label=""
          style={{ margin: 8 }}
          placeholder="Osoite"
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
        </Grid>
        <Grid>
        <TextField
          id="tf-postcode"
          label=""
          style={{ margin: 8 }}
          placeholder="Postinumero"
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />       
        <TextField
          id="tf-city"
          label=""
          style={{ margin: 8 }}
          placeholder="Postitoimipaikka"
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
        </Grid>     
        </form>
        </Grid>
        </div> 
    );
}

export default Register;