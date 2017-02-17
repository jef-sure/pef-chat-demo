"use strict";
import {encode_json, decode_json} from './json_utf8';
let instance = null;

export default class wsAjax {
    constructor(onOpen, onError, onMessage, onNotOk) {
        if (onOpen)
            this.onOpen = onOpen;
        if (onError)
            this.onError = onError;
        if (onMessage)
            this.onMessage = onMessage;
        if (onNotOk)
            this.onNotOk = onNotOk;
        if (!instance) {
            this.nextReconnect = 1;
            this.on = false;
            this.inReconnect = false;
            this.queue = [];
            this.waitQueue = {};
            instance = this;
        }
        return instance;
    }

    reconnect() {
        console.log('reconnect websocket');
        if (instance.inReconnect) {
            console.log('already in reconnect');
            return;
        }
        instance.inReconnect = true;
        if (instance.ws) instance.ws.close();
        instance.ws = null;
        setTimeout(() => {
            if (instance.nextReconnect < 30)
                instance.nextReconnect += 1 + instance.nextReconnect / 3;
            if (instance.nextReconnect > 30)
                instance.nextReconnect = 30;
            if (instance.on)
                instance.init();
        }, instance.nextReconnect * 1000);
    }

    init() {
        console.log('init websocket');
        instance.ws = new WebSocket(websocketUrl);
        instance.on = true;
        instance.inReconnect = false;
        const ws = instance.ws;
        ws.onopen = () => {
            console.log('on open');
            instance.nextReconnect = 1;
            let r;
            while (r = instance.queue.shift()) {
                ws.send(JSON.stringify(r));
            }
            instance.onOpen(instance);
        };
        ws.onmessage = (e) => {
            let response = decode_json(e.data);
            if (response.rid && response.rid in instance.waitQueue) {
                let cb = instance.waitQueue[response.rid].callback;
                delete instance.waitQueue[response.rid];
                if (response.ajax_response.body.result !== 'OK' && instance.onNotOk)
                    instance.onNotOk(response.ajax_response);
                else if (cb) cb(response.ajax_response);
            } else {
                if (instance.onMessage)
                    instance.onMessage(response);
            }
        };
        ws.onerror = (e) => {
            let message = e.message || e.code || 'Refused connection';
            instance.onError(message);
            instance.reconnect();
        }
        ws.onclose = (e) => {
            instance.onError('Connection closed');
            instance.reconnect();
        }
    }

    close() {
        instance.ws = null;
        instance.on = false;
        instance.queue = [];
        instance.waitQueue = {};
    }

    send(rpc, callback) {
        if (!instance.on) {
            console.log('No message sent on uninitialized socket: ', rpc);
            throw new Error('No message sent');
        }
        rpc.rid = '' + Math.random();
        instance.waitQueue[rpc.rid] = {
            startTime: new Date(),
            callback: callback
        };
        if (!instance.ws)
            instance.queue.push(rpc);
        else
            instance.ws.send(encode_json(rpc));
    }
}
