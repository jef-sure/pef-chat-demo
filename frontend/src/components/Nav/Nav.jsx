"use strict";
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {measureTextWidth} from '../../lib/measure_text_width';
import {DivFlexColumn, DivFlexFixed, DivFlexRow, DivFlexStretch, DivPaddingFill} from '../Layout.jsx';
import {Link, LocationMatch} from '../HashRouter.jsx';
import {modalOpenNewChat} from '../../actions/modal';

function navSubItems(model, key, path, selected) {
    return <DivFlexStretch className="vscroll_auto">
        <ul className="main_nav_sub_list">
            {
                model.map((item, index) =>
                    <li className="list_no_wraps_no_discs"
                        key={index + (selected && item.id == selected ? "selected" : "item")}>
                        <Link
                            className={selected && item.id == selected ? "main_nav_selected_sub_item" : "main_nav_sub_item"}
                            to={path + "/" + item.id}>
                            {item[key]}
                        </Link>
                    </li>
                )
            }
        </ul>
    </DivFlexStretch>;
}

const navStruct = [
    {
        name: "Chats",
        addNew: modalOpenNewChat,
        path: "/chat",
        modelKey: "chats",
        titleKey: "name",
    },
    {
        name: "Themes",
        addNew: false,
        path: "/theme",
        modelKey: "themes",
        titleKey: "subject",
    },
    {
        name: "Members",
        path: "/member",
        modelKey: "members",
        titleKey: "login",
    },
];

const NavSelected = (modelSrc, index, dispatchProvider) => ({id}) => <DivFlexColumn className="flex_stretch"
                                                                                    key={(1 + index) + "selected"}>
        <ul className="main_nav_list flex_fixed">
            <li>
                <Link to={navStruct[index].path}
                      className="main_nav_section_selected">{navStruct[index].name}
                    &nbsp;
                    {navStruct[index].addNew ?
                        <span className="badge"
                              onClick={() => dispatchProvider()(navStruct[index].addNew())}>+</span> : null}
                </Link>
            </li>
        </ul>
        {navSubItems(modelSrc(), navStruct[index].titleKey, navStruct[index].path, id)}
    </DivFlexColumn>
    ;

const NavClear = (index, dispatchProvider) => () =>
        <DivFlexFixed key={1 + index}>
            <ul className="main_nav_list flex_fixed">
                <li>
                    <Link to={navStruct[index].path}
                          className="main_nav_section_next_1">{navStruct[index].name}
                        &nbsp;
                        {navStruct[index].addNew ?
                            <span className="badge"
                                  onClick={() => dispatchProvider()(navStruct[index].addNew())}>+</span> : null}
                    </Link>
                </li>
            </ul>
        </DivFlexFixed>
    ;

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.maxNavString = navStruct.reduce(
                (a, c) => c.name.length > a.length ? c.name : a, ""
            )
            + "WWWWW";
        this.maxNavStringInitial = this.maxNavString;
    }

    componentDidMount() {
        this.recalcMinWidth();
        this.forceUpdate = () => this.recalcMinWidth();
        window.addEventListener('resize', this.forceUpdate);
    }

    componentDidUpdate() {
        this.recalcMinWidth();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.forceUpdate)
    }

    recalcMinWidth() {
        for (let ns of navStruct) {
            this.maxNavString = this.props[ns.modelKey].reduce(
                    (a, c) => c[ns.titleKey].length > a.length ? c[ns.titleKey] : a,
                    this.maxNavStringInitial
                ) + "WWWWW";
        }
        this.minNavWidth = measureTextWidth(this.maxNavString, this.mainNav);
        this.minNavWidth = Math.min(this.minNavWidth, document.documentElement.clientWidth / 3);
        this.setMinWidth(this.minNavWidth + 'px');
    }

    getMinWidth() {
        return this.minNavWidth;
    }

    setMinWidth(width) {
        this.mainNav.style.minWidth = width;
    }

    render() {
        const dispatchProvider = () => this.props.dispatch;
        return <DivFlexFixed className="relative" refProp={e => this.mainNav = e}>
            <DivPaddingFill>
                <DivFlexColumn className="full_height">
                    {
                        navStruct.map((item, index) =>
                            <LocationMatch if={item.path + "(/:id)"}
                                           then={NavSelected(() => this.props[item.modelKey], index, dispatchProvider)}
                                           else={NavClear(index, dispatchProvider)}
                                           key={index}
                            />
                        )
                    }
                </DivFlexColumn>
            </DivPaddingFill>
        </DivFlexFixed>;
    }
}

function stateToNav(state) {
    return {
        chats: state.model.chats,
        members: state.model.members,
        themes: state.model.themes,
        location: state.location
    }
}

export default connect(stateToNav)(Nav);