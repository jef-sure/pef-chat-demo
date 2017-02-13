"use strict";
import React from 'react';
import {connect} from 'react-redux'
import './LoginForm.css';
import {loginSubmit} from '../../actions/login'

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const dispatch = this.props.dispatch;
        const errTxt = 'errorText' in this.props ? this.props.errorText : "\u00A0";
        const errDiv = <div className="has-error"><span className="help-block">{errTxt}</span></div>;
        return (
            <div className="modal-dialog">
                <div className="loginmodal-container">
                    <h1>Login to Your Account</h1>
                    <form onSubmit={
                        (evt) => {
                            evt.preventDefault();
                            dispatch(loginSubmit(this.user.value, this.password.value))
                        }
                    }>
                        {errDiv}
                        <input type="text" name="user" placeholder="Username"
                               className="form-control"
                               required={true}
                               ref={(user) => this.user = user}
                        />
                        <input type="password" name="pass" placeholder="Password"
                               className="form-control"
                               required={true}
                               ref={(password) => this.password = password}
                        />
                        <input type="submit" name="login" className="login loginmodal-submit" value="Login"/>
                    </form>
                    <div className="login-help">
                        <a href="#">Register</a> - <a href="#">Forgot Password</a>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToLogin = (state) => state.state;

export default connect(mapStateToLogin)(LoginForm);
