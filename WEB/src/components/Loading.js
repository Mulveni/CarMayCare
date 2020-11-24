import React from 'react';
import { useTranslation } from 'react-i18next';

const Loading = () => {

    const { t } = useTranslation();

    return (
        <div>
            Loading...
        </div >
    )
}

export default Loading;