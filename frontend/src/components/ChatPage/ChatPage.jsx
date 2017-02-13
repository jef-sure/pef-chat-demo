"use strict";
import React from 'react';
import {connect} from 'react-redux';
import providesViewport from '../../lib/providesViewport';
import Header from '../Header/Header.jsx';
import Toggle from '../Toggle/Toggle.jsx'
import {toggleNav} from '../../actions/toggle';
import './ChatPage.scss';
import Nav from '../Nav/Nav.jsx';
import MainArea from '../MainArea/MainArea.jsx';
import {DivFlexColumn, DivFlexFixed, DivFlexRow, DivFlexStretchFill, DivFlexStretch} from '../Layout.jsx';

class ChatPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {dispatch, isNavOn} = this.props;
        return (<DivFlexColumn className="full_height">
                <Header/>
                <DivFlexStretchFill>
                    <DivFlexRow>
                        <Toggle divOptions={{style: {"height": "100%"}, className: "flex_fixed"}}
                                isOn={isNavOn}
                                isAfter={true}
                                color="rgb(51,51,51)"
                                onClick={() => {dispatch(toggleNav(isNavOn))
                                }}>
                            <Nav/>
                        </Toggle>
                        <MainArea />
                    </DivFlexRow>
                </DivFlexStretchFill>
            </DivFlexColumn>
        )
    }
}

const mapStateToLogin = (state) => {
    return {
        isNavOn: state.visual.isNavOn
    };
}

export default providesViewport(connect(mapStateToLogin)(ChatPage));
