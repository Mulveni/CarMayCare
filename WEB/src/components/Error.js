import React from 'react';
import { useTranslation } from 'react-i18next';

const Error = () => {

    const { t } = useTranslation();

    return (
        <div>
            Server error
        </div >
    )
}

export default Error;