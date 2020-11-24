import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';

const Error = () => {

    const { t } = useTranslation();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideNavButtons());
    }, [dispatch]);

    return (
        <div>
            Server error
        </div >
    )
}

export default Error;