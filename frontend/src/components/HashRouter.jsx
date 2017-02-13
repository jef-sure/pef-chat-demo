/**
 * Created by anton on 09.02.17.
 */
"use strict";
import React from 'react';
import {connect} from 'react-redux';
import matcher from '../lib/matcher';


export class Link extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let props = Object.assign({}, this.props);
        let to = "#" + props.to;
        let children = props.children;
        delete props["to"];
        delete props["children"];
        return <a href={to} {...props}>{children}</a>;
    }
}

export class _LocationMatch extends React.Component {
    constructor(props) {
        super(props);
        this.exact = this.props.exact ? true : false;
        this.matcher = matcher(this.props.if, this.exact);
        this.Then = this.props.then || null;
        this.thenProps = this.props.thenProps || {};
        this.Else = this.props.else || null;
        this.elseProps = this.props.elseProps || {};
        this.thenCB = this.props.thenCB || null;
        this.elseCB = this.props.elseCB || null;
    }

    render() {
        let params = {};
        const {matcher, Then, Else, thenProps, elseProps} = this;
        if (matcher(this.props.location, params)) {
            let props = Object.assign({}, thenProps, params);
            if (this.thenCB)
                this.thenCB(params, this.props.if);
            if (Then === null)
                return Then;
            if (typeof Then === 'function')
                return <Then {...props} />;
            else
                return Then;
        } else {
            if (this.elseCB)
                this.elseCB(this.props.if);
            if (Else === null)
                return Else;
            if (typeof Else === 'function')
                return <Else {...elseProps} />;
            else
                return Else;
        }
    }
}

function locationFromState(state) {
    return {location: state.location};
}

export const LocationMatch = connect(locationFromState)(_LocationMatch);

export function redirectLocation(to) {
    if (to.charAt(0) !== '/') {
        let cl = window.location.hash.substring(1);
        let cp = cl.lastIndexOf("/");
        if (cp === -1) {
            to = "/" + to;
        } else {
            to = cl.substring(0, cp + 1) + to;
        }
    }
    window.location.replace(window.location.pathname + window.location.search + "#" + to);
}

export function Redirect({to}) {
    redirectLocation(to);
    return null;
}