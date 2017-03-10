"use strict";
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {DivFlexColumn, DivFlexFixed, DivFlexRow, DivFlexStretchFill, DivPaddingFill} from '../Layout.jsx';
import {Link, LocationMatch} from '../HashRouter.jsx';
import Chat from '../ChatArea/ChatArea.jsx';

function Theme() {
    return <div>Theme</div>
}

function Member() {
    return <div>Member</div>
}

function Select({area}) {
    return <div>Select: {area}</div>
}

function SelectChat() {
    return <LocationMatch if="/chat" then={Select} thenProps={{area: "Chat"}}/>
}

function SelectTheme() {
    return <LocationMatch if="/theme" then={Select} thenProps={{area: "Theme"}}/>
}

function SelectMember() {
    return <LocationMatch if="/member" then={Select} thenProps={{area: "Member"}}/>
}

function SelectAny() {
    return <LocationMatch if="/*" else={Select} elseProps={{area: "Any"}}/>
}

class MainArea extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {dispatch, isNavOn} = this.props;
        return (<DivFlexStretchFill>

                    <LocationMatch if="/chat/:id" then={Chat} else={SelectChat}/>
                    <LocationMatch if="/theme/:id" then={Theme} else={SelectTheme}/>
                    <LocationMatch if="/member/:id" then={Member} else={SelectMember}/>
                    <LocationMatch if="/*/:id" else={SelectAny}/>
                    <LocationMatch if="/" exact={true} then={Select} thenProps={{area: "AnySection"}}/>

            </DivFlexStretchFill>
        )
    }
}

function stateToNav(state) {
    return {
        chats: state.model.chats,
        members: state.model.members,
        themes: state.model.themes
    }
}

export default connect(stateToNav)(MainArea);
