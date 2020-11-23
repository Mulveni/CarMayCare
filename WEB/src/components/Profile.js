import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { showNavButtons } from '../actions';

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