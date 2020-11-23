import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';

const NotFound = () => {

    const { t } = useTranslation();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideNavButtons());
    }, []);

    return (
        <div>
            Server error
        </div >
    )
}

export default NotFound;