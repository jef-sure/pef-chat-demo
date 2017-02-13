"use strict";
import * as Constants from './constants';
import axios from 'axios';

export function initializeModel(model_body) {
    return {
        type: Constants.MODEL_INITIALIZE,
        payload: model_body
    }
}

export function uninitializeModel() {
    return {
        type: Constants.MODEL_UNINITIALIZE
    }
}
