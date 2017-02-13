"use strict";
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import LoginForm from './LoginForm/LoginForm.jsx';
import EmptyPage from './EmptyPage.jsx'
import ChatPage from './ChatPage/ChatPage.jsx';

function mapStateToMain(state) {
    return {
        state: state.state,
        model: state.model
    };
}

class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.state.isLoggedIn) {
            if (Object.keys(this.props.model).length == 0) {
                return (
                    <EmptyPage/>
                );
            } else {
                return (
                    <ChatPage/>
                );
            }
        } else {
            return (
                <LoginForm/>
            )
        }
    }
}


export default connect(mapStateToMain)(Main);