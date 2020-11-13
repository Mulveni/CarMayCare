import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {

    const { t } = useTranslation();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideNavButtons());
    }, []);

    return (
        <div>
            FORGOT PASSWORD PAGE
        </div >
    )
}

export default ForgotPassword;