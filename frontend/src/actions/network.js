"use strict";
import * as Constants from './constants';
import axios from 'axios';

export function networkError(errorMessage) {
    return {
        type: Constants.NETWORK_ERROR,
        payload: errorMessage
    }
}
