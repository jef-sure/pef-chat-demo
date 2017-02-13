"use strict";
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {DivFlexColumn, DivFlexFixed, DivFlexRow, DivFlexStretchFill, DivPaddingFill} from '../Layout.jsx';
import jpath from '../../lib/jpath';
import {chatJoin} from '../../actions/chatOps';

function mapStateToChat(state, props) {
    console.log("map to Chat props:", props);
    let chat = state.model.chats.find((e) => e.id == props.id) || {
            message_log: [],
            member_list: []
        };
    return {
        chats: state.model.chats,
        model: state.model,
        isLoggedIn: state.state.isLoggedIn,
        chat: chat
    };
}

function checkWhetherToJoin(props) {
    if (!props.isLoggedIn) return;
    const chat_id = props.id;
    const my_id = props.model.me.id;
    let chat = props.chat;
    if (!chat.member_list.find((m) => m == my_id)) {
        const dispatch = props.dispatch;
        dispatch(chatJoin(chat_id));
    }
}

const Chat = connect(mapStateToChat)(class _Chat extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        console.log("Chat next props: %o -> %o", this.props, nextProps);
        checkWhetherToJoin(nextProps);
    }

    componentDidMount() {
        console.log("Chat mount props: %o", this.props);
        checkWhetherToJoin(this.props);
    }

    render() {
        console.log("Chat render props: %o", this.props);
        return <div>Chat</div>;
    }
});

export default Chat;