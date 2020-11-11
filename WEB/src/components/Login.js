import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideNavButtons, logIn } from '../actions';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {

    const { t } = useTranslation();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideNavButtons());
    }, []);

    const loginUser = () => {
        dispatch(logIn());
    }


    return (
        <div>
            LOGIN PAGE
            <br />
            <Link onClick={loginUser} to="/">Login</Link>
        </div >
    )
}

export default Login;