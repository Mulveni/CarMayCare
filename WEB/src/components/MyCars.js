import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNavButtons } from '../actions';
import { useTranslation } from 'react-i18next';

const MyCars = () => {

    const { t } = useTranslation();

    return (
        <div>
            MyCars
        </div >
    )
}

export default MyCars;