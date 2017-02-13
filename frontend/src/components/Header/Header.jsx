"use strict";
import React from 'react';
import {connect} from 'react-redux';
import './Header.scss';
import Toggle from '../Toggle/Toggle.jsx';
import style from '../style.inc.scss';
import {toggleHeader} from '../../actions/toggle'

function mapStateToHeader(state) {
    return {
        isHeaderOn: state.visual.isHeaderOn,
        headerText: state.system.headerText,
        login: (state.state.isLoggedIn ? state.login : '')
    }
}

class Header extends React.Component {
    render() {
        const {isHeaderOn, headerText, login, dispatch} = this.props;
        return (
            <Toggle
                divOptions={{style: {height: "auto"}}}
                isOn={isHeaderOn}
                isHorisontal={true}
                isAfter={true}
                color={style.textColor}
                onClick={() => dispatch(toggleHeader(isHeaderOn))}>
                <header className="teamname">{headerText}
                    <div className="sysmsg"><span className="key">{login}&nbsp;&nbsp;</span>
                        <a className="text-danger no_decoration">Logout</a>
                    </div>
                </header>
            </Toggle>
        )
    }
}

export default connect(mapStateToHeader)(Header);