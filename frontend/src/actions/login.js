"use strict";
import * as Constants from './constants';
import axios from 'axios';

export function loginSubmit(login, password) {
    return dispatch => {
        dispatch({
            type: Constants.LOGIN_CLEAR_ERROR
        });
        return axios({
            method: 'post',
            url: '/ajaxMemberLogin',
            data: {
                login: login,
                password: password
            }
        }).then((response) => {
                console.log(response)
                let payload = Object.assign({}, response.data);
                payload.login = login;
                dispatch({
                    type: Constants.LOGIN_RESPONSE,
                    payload: payload
                });
            }
        ).catch((response) => {
            let payload = response.data && typeof response.data === 'object' && response.data.answer ? response.data.answer : response.statusText;
            dispatch({
                type: Constants.LOGIN_ERROR,
                payload: payload
            });
        })
    }
}
