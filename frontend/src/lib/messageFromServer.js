/**
 * Created by anton on 17.02.17.
 */

import {parseDate} from './dateformat';
import * as Constants from '../actions/constants';

export function convertMessageFromServer(payload, my_id) {
    payload.message_time = parseDate(payload.message_time);
    payload.html_message = global.markdown.render(payload.message);
    payload.status = (payload.member_id == my_id ? Constants.MESSAGE_MINE : Constants.MESSAGE_RECEIVED);
}