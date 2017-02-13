"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import watch from 'redux-watch';
import markdownFactory from 'markdown-it';
import emoji from 'markdown-it-emoji';
import mdins from 'markdown-it-ins';
import mdmark from 'markdown-it-mark';
import mdsup from 'markdown-it-sup';
import mdsub from 'markdown-it-sub';
import mdabbr from 'markdown-it-abbr';
import mddeflist from 'markdown-it-deflist';
import hljs from 'highlight.js';

import './style/highlight-dune-light.scss';
import * as Constants from './actions/constants';
import {initializeModel} from './actions/model';
import {consoleLog, consoleLogHide} from './actions/consoleLog';

import wsAjax from './lib/wsAjax';

import Main from './components/Main.jsx';

import reducer from './reducers/reducer';

global.markdown = markdownFactory({
    html: false,        // Enable HTML tags in source
    xhtmlOut: false,        // Use '/' to close single tags (<br />).
                            // This is only for full CommonMark compatibility.
    breaks: false,        // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-',  // CSS language prefix for fenced blocks. Can be
                              // useful for external highlighters.
    linkify: true,        // Autoconvert URL-like text to links

    // Enable some language-neutral replacement + quotes beautification
    typographer: false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '“”‘’',

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre className="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            } catch (e) {
                console.log(e);
            }
        }
        return '<pre className="hljs"><code>' + global.markdown.utils.escapeHtml(str) + '</code></pre>';
    }
});

global.markdown
    .use(emoji)
    .use(mdins)
    .use(mdmark)
    .use(mdsub)
    .use(mdsup)
    .use(mdabbr)
    .use(mddeflist);

global.markdown.renderer.rules.table_open = function () {
    return '<table class="table table-striped">\n';
};

const logger = store => next => action => {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', store.getState())
    return result
}

let store = createStore(reducer,
    applyMiddleware(
        logger,
        thunkMiddleware
    )
);

function gotLocation() {
    store.dispatch({
        type: Constants.LOCATION_CHANGE,
        payload: window.location.hash.substr(1)
    })
}
window.addEventListener('hashchange', gotLocation, false);

let watchLoggedIn = watch(store.getState, 'state.isLoggedIn');
let watchLocation = watch(store.getState, 'location');
let lastWsError = null;

function websocketOnOpen(ws) {
    console.log("app on open");
    ws.send({
        ajax: {
            method: "model get initial"
        }
    }, (response) => {
        console.log("initial response: ", response);
        if (response.body.result === 'OK') {
            lastWsError = null;
            store.dispatch(consoleLog('info', 'Established connection'));
            store.dispatch(initializeModel(response.body));
            store.dispatch(consoleLogHide());
        } else {
            lastWsError = response.body.answer;
            store.dispatch(consoleLog('error', response.body.answer));
        }
    });
}

function websocketOnError(errMessage) {
    console.log("ws error: ", errMessage);
    if (lastWsError === "Refused connection" && errMessage === "Connection closed")
        return;
    lastWsError = errMessage;
    store.dispatch(consoleLog('error', errMessage));
}

function websocketOnMessage(message) {
    console.log("message: ", message);
    store.dispatch({
        type: message.action,
        payload: message.params
    });
}

store.subscribe(watchLoggedIn((newVal, oldVal, objectPath) => {
    console.log('%s changed from %s to %s', objectPath, oldVal, newVal);
    if (!oldVal && newVal) {
        let ws = new wsAjax(websocketOnOpen, websocketOnError, websocketOnMessage);
        ws.init();
    } else if (oldVal && !newVal) {
        let ws = new wsAjax();
        ws.close();
        store.dispatch(uninitializeModel());
    }
}));

store.subscribe(watchLocation((newVal, oldVal, objectPath) => {
    console.log('%s changed from %s to %s', objectPath, oldVal, newVal);
}));

store.dispatch({type: "app/INIT"});

ReactDOM.render(
    <Provider store={store}>
        <Main />
    </Provider>
    ,
    document.getElementById("app")
);
