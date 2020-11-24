import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showNavButtons } from '../actions';
import { useForm, Controller } from "react-hook-form";
import baseApiUrl from '../api_url.json';
import axios from 'axios';
import {
    Container,
    Button,
    TextField, 
    Typography, 
    Select, 
    FormControl, 
    MenuItem, 
    InputLabel,
    FormHelperText
    } from "@material-ui/core";

const Profile = () => {

    const { t } = useTranslation();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showNavButtons());
    }, [dispatch]);

    return (
        <div>
            PROFILE PAGE
        </div >
    )
}

export default Profile;