"use strict";
import React from 'react';
import style from './Toggle.scss'

const HrLine = ({color}) => <span style={{
    flex: "1 1 auto",
    height: "1px",
    backgroundColor: color,
    alignSelf: "center",
    marginLeft: "0.25em",
    marginRight: "0.25em",
    marginTop: "0.5em"
}}></span>

const VrLine = ({color}) => <hr style={{
    flex: "1 1 auto",
    width: "1px",
    backgroundColor: color,
    alignSelf: "stretch",
    marginBottom: "0.25em",
    marginTop: "0.25em",
    marginLeft: "0.5em"
}}/>

const arrowUp = <span>⇑ ⇑ ⇑ ⇑ ⇑</span>;
const arrowDown = <span>⇓ ⇓ ⇓ ⇓ ⇓</span>;
const arrowLeft = <span>⇐ ⇐ ⇐ ⇐ ⇐</span>;
const arrowRight = <span>⇒ ⇒ ⇒ ⇒ ⇒</span>;

const HrDiv = (props) => {
    const {color, arrow, onClick} = props;
    let rest = {};
    if (props.flexOrder)
        rest.order = props.flexOrder;
    if (props.div)
        for (let opt in props.div) {
            rest.opt = props.div[opt]
        }
    return <div style={{
        height: "1em",
        maxHeight: "1em",
        minHeight: "1em",
        display: "flex",
        flexDirection: "row",
        alignSelf: "stretch",
        marginBottom: "0.3em",
        ...rest
    }}>
        <HrLine color={color}/>
        <a className="no_decoration" onClick={onClick} style={{
            height: "1em",
            maxHeight: "1em",
            minHeight: "1em",
            flex: "0 0 auto"
        }}> {arrow}</a>
        <HrLine color={color}/>
    </div>;
};

const VrDiv = (props) => {
    const {color, arrow, onClick} = props;
    let rest = {};
    if (props.flexOrder)
        rest.order = props.flexOrder;
    if (props.div)
        for (let opt in props.div) {
            rest.opt = props.div[opt]
        }
    return <div style={{
        minWidth: "1em",
        maxWidth: "1em",
        fontSize: "1em",
        alignSelf: "stretch",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        ...rest
    }}>
        <VrLine color={color}/>
        <a className="no_decoration" onClick={onClick} style={{
            textAlign: "center",
            maxWidth: "1em",
            display: "block",
        }}> {arrow}</a>
        <VrLine color={color}/>
    </div>
};

class Toggle extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let div;
        const {
            isOn, isHorisontal, isAfter,
            color, onClick
        } = this.props;
        let divOptions = this.props.divOptions || {};
        if (!divOptions.className) divOptions.className = '';
        divOptions.className += (isHorisontal ? ' flex_column' : ' flex_row');
        let arrow;
        let ldiv;
        if (isHorisontal) {
            arrow = (isOn && isAfter) || (!isOn && !isAfter) ? arrowUp : arrowDown;
            ldiv = <HrDiv arrow={arrow} color={color} onClick={onClick}/>;
        } else {
            arrow = (isOn && isAfter) || (!isOn && !isAfter) ? arrowLeft : arrowRight;
            ldiv = <VrDiv arrow={arrow} color={color} onClick={onClick}/>;
        }
        const toShow = isOn ? this.props.children : '';
        if (isAfter) {
            div = <div {...divOptions}> {toShow} {ldiv} </div>;
        } else {
            div = <div {...divOptions}> {ldiv} {toShow} </div>;
        }
        return div;
    }
}

export default Toggle;
