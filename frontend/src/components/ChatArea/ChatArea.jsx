"use strict";
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {DivFlexFixed, DivFlexRow, DivFlexStretchFill, DivFlexStretch} from '../Layout.jsx';
import jpath from '../../lib/jpath';
import {userColor} from '../../lib/user_color';
import {chatJoin, sendChatMessage, setChatTitle, loadChatEarlier, leaveChat, destroyChat} from '../../actions/chatOps';
import TextareaAutoSize from '../TextareaAutoSize.jsx';
import InputOnClick from './InputOnClick.jsx';
import Toggle from '../Toggle/Toggle.jsx';
import MemberList from '../MemberList/MemberList.jsx';
import {toggleChatMemberList} from '../../actions/toggle';
import * as Constants from '../../actions/constants';
import {redirectLocation} from '../HashRouter.jsx';

function coalesce(ptr, elem, otherwise) {
    return ptr ? ptr[elem] : otherwise;
}

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
        message_log: coalesce(chat, "message_log", []),
        member_list: coalesce(chat, "member_list", []),
        title: coalesce(chat, "title", ''),
    };
}
/*
 If server says 'no such chat' or some another error -- it should be somehow processed
 */
function checkWhetherToJoin(props) {
    if (!props.chat) {
        redirectLocation("/chat");
        return;
    }
    if (!props.isLoggedIn) return;
    const chat_id = props.id;
    if (props.isNeedLoad)
        props.dispatch(chatJoin(chat_id));
}

const Chat = connect(mapStateToChat)(class _Chat extends React.Component {
    constructor(props) {
        super(props);
        this.previousInput = "";
    }

    checkWhetherToLoadEarlier() {
        if (this.props.chat && this.props.chat.canHaveEarlier && this.props.message_log.length != 0) {
            const ch = this.chatArea.clientHeight;
            const sh = this.mainDisplayArea.scrollHeight;
            if (sh < ch) {
                this.props.dispatch(loadChatEarlier(this.props.chat.id, this.props.message_log[0].message_time));
                this.expectUpper = true;
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("Chat next props: %o -> %o", this.props, nextProps);
        checkWhetherToJoin(nextProps);
    }


    componentDidMount() {
        console.log("Chat mount props: %o", this.props);
        checkWhetherToJoin(this.props);
        this.checkWhetherToLoadEarlier();
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
        this.psh = sh;
        if (ch < sh) {
            this.scrollPosition = st / (sh - ch);
        } else
            this.scrollPosition = 1;
        if (st == 0 && ch < sh && this.props.chat && this.props.chat.canHaveEarlier && this.props.message_log.length != 0) {
            this.props.dispatch(loadChatEarlier(this.props.chat.id, this.props.message_log[0].message_time));
            this.expectUpper = true;
        }
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
        if (!this.mainDisplayArea)
            return;
        const ch = this.mainDisplayArea.clientHeight;
        const sh = this.mainDisplayArea.scrollHeight;
        const dsh = sh - this.psh;
        if (dsh > 0 && sh > ch && this.expectUpper) {
            this.expectUpper = false;
            const st = this.mainDisplayArea.scrollTop;
            this.mainDisplayArea.scrollTop = st + dsh;
            this.scrollPosition = (st + dsh) / (sh - ch);
        } else {
            this.updateScrollPosition();
        }
        this.checkWhetherToLoadEarlier();
    }

    handleSubmit(event) {
        console.log("chatInput: %o", this.chatInput.valueOf());
        if (event)
            event.preventDefault();
        this.chatInput.focus();
        if (/^\s*$/.test(this.chatInput.valueOf())) return;
        this.previousInput = this.chatInput.valueOf();
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

    handleKeyDown(event) {
        if (event.keyCode === 38 /* Up */ && this.chatInput.valueOf() === "") {
            this.chatInput.setState({value: this.previousInput});
            this.scrollPosition = 1;
            this.updateScrollPosition();
        } // else if (event.keyCode === 40 /* Down */ && this.chatInput.valueOf() === this.previousInput) {
        //     this.chatInput.setState({value: ""});
        //     this.scrollPosition = 1;
        //     this.updateScrollPosition();
        // }
    }

    showMessageList() {
        let messageLog = this.props.message_log;
        return messageLog.map((item, index) => {
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

    leaveChat() {
        this.props.dispatch(leaveChat(this.props.chat.id));
        redirectLocation("/chat");
    }

    destroyChat() {
        if (this.destroyChatCheck.checked) {
            this.props.dispatch(destroyChat(this.props.chat.id));
            redirectLocation("/chat");
        }
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
            <DivFlexFixed style={{height: "3em"}}>
                <DivFlexRow>
                    <DivFlexStretch>
                        <InputOnClick
                            style={{
                                paddingLeft: "5px",
                                width: "100%",
                                cursor: "default",
                                height: "3em"
                            }}
                            className="form-control"
                            value={this.props.title}
                            onSubmit={(title) => {
                                setTimeout(() => this.chatInput.focus(), 0);
                                dispatch(setChatTitle(this.props.chat.id, title));
                            }}
                            returnFocus={() => setTimeout(() => this.chatInput.focus(), 0)}
                        />
                    </DivFlexStretch>
                    {
                        this.props.me.id != this.props.chat.owner_id
                            ? <DivFlexFixed>
                                <button type="button" className="btn btn-danger" onClick={() => this.leaveChat()}>
                                    Leave
                                </button>
                            </DivFlexFixed>
                            : <DivFlexFixed
                                style={{
                                    paddingTop: "0.12em",
                                    paddingBottom: 0,
                                }}
                                className="btn emergency"
                                onClick={() => this.destroyChat()}
                            >
                                <div style={{lineHeight: "1em"}}>
                                    <span style={{fontWeight: "bold"}}>🕱</span>
                                    &nbsp;Destroy&nbsp;
                                    <span style={{fontWeight: "bold"}}>🕱</span>
                                </div>
                                <div style={{transform: "scale(0.7)", lineHeight: "0.7em"}}>
                                    <input type="checkbox"
                                           ref={(r) => this.destroyChatCheck = r}
                                           id="destroyChatCheck"
                                           onClick={(e) => e.stopPropagation()}
                                    />
                                    <label htmlFor="destroyChatCheck" style={{marginBottom: 0}}
                                           onClick={(e) => e.stopPropagation()}
                                    >&nbsp;I'm sure</label>
                                </div>
                            </DivFlexFixed>
                    }
                </DivFlexRow>
            </DivFlexFixed>
            <DivFlexStretchFill>
                <DivFlexRow>
                    <DivFlexStretch refProp={(r) => this.chatArea = r} className="message_log">
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
                                      onKeyDown={(e) => this.handleKeyDown(e)}
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