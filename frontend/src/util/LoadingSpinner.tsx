import React from 'react';
import {Loader} from "semantic-ui-react";

type LoadingSpinnerProps = {
    active?: boolean,
    message?: string
}

function LoadingSpinner({active, message}: LoadingSpinnerProps) {
    if (!message) {
        message = "Please wait...";
    }

    return (
        <Loader active={active} inline="centered" content={message}/>
    );
}

export default LoadingSpinner;