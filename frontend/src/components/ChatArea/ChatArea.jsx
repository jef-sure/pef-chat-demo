"use strict";
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {DivFlexFixed, DivFlexRow, DivFlexStretchFill, DivFlexStretch} from '../Layout.jsx';
import jpath from '../../lib/jpath';
import {userColor} from '../../lib/user_color';
import {chatJoin,sendChatMessage} from '../../actions/chatOps';
import TextareaAutoSize from '../TextareaAutoSize.jsx';
import InputOnClick from './InputOnClick.jsx';
import Toggle from '../Toggle/Toggle.jsx';
import MemberList from '../MemberList/MemberList.jsx';
import {toggleChatMemberList} from '../../actions/toggle';
import * as Constants from '../../actions/constants';


function mapStateToChat(state, props) {
    console.log("map to Chat props:", props);
    const my_id = state.model.me.id;
    let chat = state.model.chats.find((e) => e.id == props.id);
    let isNeedLoad = false;
    if (chat && !chat.member_list.find((m) => m == my_id))
        isNeedLoad = true;
    return {
        chats: state.model.chats,
        model: state.model,
        me: state.model.me,
        isLoggedIn: state.state.isLoggedIn,
        isChatMemberListOn: state.visual.isChatMemberListOn,
        chat: chat,
        isNeedLoad: isNeedLoad,
        message_log: chat.message_log,
    };
}
/*
 If server says 'no such chat' or some another error -- it should be somehow processed
 */
function checkWhetherToJoin(props) {
    if (!props.isLoggedIn) return;
    const chat_id = props.id;
    if (props.isNeedLoad)
        props.dispatch(chatJoin(chat_id));
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
        if (!this.chatInput)
            return;
        if (this.chatInputHeight) {
            this.chatInputButton.style.height = this.chatInputHeight;
            this.chatInputHeight = 0;
        }
        if (typeof this.props.chatInput !== 'undefined' && this.props.chatInput !== null) {
            this.chatInput.setState({value: this.props.chatInput});
        }
        this.chatInput.focus();
        if (typeof this.props.scrollPosition === 'undefined' || this.props.scrollPosition === null) {
            this.scrollPosition = 1;
        } else {
            this.scrollPosition = this.props.scrollPosition;
        }
        const ch = this.mainDisplayArea.clientHeight;
        const sh = this.mainDisplayArea.scrollHeight;
        this.mainDisplayArea.scrollTop = (sh - ch) * this.scrollPosition;
    }

    storeScrollPosition() {
        if (!this.mainDisplayArea)
            return;
        const ch = this.mainDisplayArea.clientHeight;
        const st = this.mainDisplayArea.scrollTop;
        const sh = this.mainDisplayArea.scrollHeight;
        if (ch < sh) {
            this.scrollPosition = st / (sh - ch);
        } else
            this.scrollPosition = 1;
    }

    updateScrollPosition() {
        if (!this.mainDisplayArea)
            return;
        const ch = this.mainDisplayArea.clientHeight;
        const sh = this.mainDisplayArea.scrollHeight;
        if (this.scrollPosition == 1)
            this.mainDisplayArea.scrollTop = sh - ch;
    }

    componentWillUpdate(nextProps) {
        this.storeScrollPosition();
    }

    componentDidUpdate(prevProps) {
        this.updateScrollPosition();
    }

    handleSubmit(event) {
        console.log("chatInput: %o", this.chatInput.valueOf());
        if (event)
            event.preventDefault();
        this.chatInput.focus();
        if (/^\s*$/.test(this.chatInput.valueOf())) return;
        this.props.dispatch(sendChatMessage(this.props.id, this.chatInput.valueOf()));
        this.chatInput.setState({value: ""});
        this.scrollPosition = 1;
        this.updateScrollPosition();
    }

    handleInput(event) {
        if (event.key === 'Enter') {
            if (!event.shiftKey) {
                event.preventDefault();
                this.handleSubmit();
            }
        }
    }

    showMessageList() {
        let messageLog = this.props.message_log;
        return messageLog.map((item) => {
            let bclass = item.status === Constants.MESSAGE_RECEIVED
                ? "message_bullet_received"
                : item.status === Constants.MESSAGE_MINE
                    ? "message_bullet_mine"
                    : "message_bullet_sending";
            let user = jpath(this.props.model.members, (m) => m.id === item.member_id, '0/login');
            return <div key={this.props.chat.id + "-" + (item.id || item.uniq_client_id) + bclass}
                        className="message_list">
                <span className={bclass}>⚫</span>&nbsp;
                <span className="nowrap message_list_time"
                      title={item.message_time.toLocaleDateString()
                      + " " + item.message_time.toLocaleTimeString()}
                >[{item.message_time.toLocaleTimeString().toLowerCase()}]</span>&nbsp;
                <span className="nowrap message_list_username"
                      style={{color: '#' + userColor(user)}}>{user}:&nbsp;</span>
                <div className="message_list_message"
                     dangerouslySetInnerHTML={{__html: item.html_message}}/>
            </div>
        })
    }

    render() {
        if (this.props.isNeedLoad) {
            return <div className="container text-center">
                <div style={{minHeight: "100vh", display: "flex", alignItems: "center"}}>
                    <h1 className="text-info col-md-12 col-sm-12 col-xs-12">Waiting for chat data</h1>
                </div>
            </div>;
        }
        if (!this.props.chat) {
            return <div className="container text-center">
                <div style={{minHeight: "100vh", display: "flex", alignItems: "center"}}>
                    <h1 className="text-info col-md-12 col-sm-12 col-xs-12">Unknown chat</h1>
                </div>
            </div>;
        }
        let intViewportHeight = window.innerHeight;
        let maxHeight = intViewportHeight / 3;
        const {isChatMemberListOn, dispatch} = this.props;
        return <div className="main_work_area">
            <DivFlexFixed>
                <DivFlexRow>
                    <DivFlexStretch>
                        <InputOnClick
                            style={{
                                paddingLeft: "5px",
                                width: "100%"
                            }}
                            value={this.props.chat.title}
                        />
                    </DivFlexStretch>
                    <DivFlexFixed>
                        <button style={{
                            paddingTop: "2px",
                            paddingBottom: "3px",
                            borderBottomLeftRadius: "2px",
                            borderBottomRightRadius: "2px",
                            borderTopLeftRadius: "2px",
                            borderTopRightRadius: "2px",
                        }} type="button" className="btn btn-danger">Leave chat
                        </button>
                    </DivFlexFixed>
                </DivFlexRow>
            </DivFlexFixed>
            <DivFlexStretchFill>
                <DivFlexRow>
                    <DivFlexStretch className="message_log">
                        <div className="main_display_area"
                             ref={mda => this.mainDisplayArea = mda}
                             onScroll={() => this.storeScrollPosition()}
                        >
                            {this.showMessageList()}
                        </div>
                    </DivFlexStretch>
                    <Toggle divOptions={{style: {"height": "100%"}, className: "flex_fixed"}}
                            isOn={isChatMemberListOn}
                            isBefore={true}
                            color="rgb(51,51,51)"
                            onClick={() => {
                                dispatch(toggleChatMemberList(isChatMemberListOn))
                            }}>
                        <MemberList member_list={this.props.chat.member_list} members={this.props.model.members}/>
                    </Toggle> </DivFlexRow>
            </DivFlexStretchFill>
            <DivFlexFixed className="input-group main_work_area_bottom">
                <div className="table_max_cell_middle">
                    <TextareaAutoSize style={{maxHeight: maxHeight}}
                                      syncHeight={ h => {
                                          if (this.chatInputButton)
                                              this.chatInputButton.style.height = h
                                          this.chatInputHeight = h
                                          this.updateScrollPosition();
                                      }}
                                      onKeyPress={(e) => this.handleInput(e)}
                                      ref={i => this.chatInput = i}
                                      id="chatInput"
                                      name="chat_input"
                    />
                </div>
                <span className="input-group-btn"><button type="button" className="btn orange"
                                                          style={{maxHeight: maxHeight, paddingTop: 0}}
                                                          ref={b => this.chatInputButton = b}
                                                          onClick={(e) => this.handleSubmit(e)}
                ><span>Send</span></button></span>
            </DivFlexFixed>
        </div>;
    }
});

export default Chat;