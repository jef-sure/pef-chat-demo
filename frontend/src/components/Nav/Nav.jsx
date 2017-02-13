"use strict";
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {measureTextWidth} from '../../lib/measure_text_width';
import {DivFlexColumn, DivFlexFixed, DivFlexRow, DivFlexStretch, DivPaddingFill} from '../Layout.jsx';
import {Link, LocationMatch} from '../HashRouter.jsx';

function navSubItems(model, key, path, selected) {
    return <DivFlexStretch className="vscroll_auto">
        <ul className="main_nav_sub_list">
            <li className="list_no_wraps_no_discs">{
                model.map((item, index) =>
                    <Link key={index + (selected && item.id == selected ? "selected" : "item")}
                        className={selected && item.id == selected ? "main_nav_selected_sub_item" : "main_nav_sub_item"}
                        to={path + "/" + item.id}>
                        {item[key]}
                    </Link>
                )
            }
            </li>
        </ul>
    </DivFlexStretch>;
}

const navStruct = [
    {
        name: "Chats",
        path: "/chat",
        modelKey: "chats",
        titleKey: "name",
    },
    {
        name: "Themes",
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

const NavSelected = (model, index) => ({id}) => <DivFlexColumn className="flex_stretch"
                                                               key={(1 + index) + "selected"}>
        <ul className="main_nav_list flex_fixed">
            <li><Link to={navStruct[index].path} className="main_nav_section_selected">{navStruct[index].name}</Link></li>
        </ul>
        {navSubItems(model, navStruct[index].titleKey, navStruct[index].path, id)}
    </DivFlexColumn>
    ;

const NavClear = (index) => () =>
        <DivFlexFixed key={1 + index}>
            <ul className="main_nav_list flex_fixed">
                <li><Link to={navStruct[index].path} className="main_nav_section_next_1">{navStruct[index].name}</Link></li>
            </ul>
        </DivFlexFixed>
    ;

class Nav extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.calcMinWidth();
        this.setMinWidth(this.minNavWidth + 'px');
    }

    componentDidUpdate() {
        this.calcMinWidth();
    }

    calcMinWidth() {
        var maxNavString = "WWWWWWWWWWWWWWWWWWWWWWW";
        this.minNavWidth = measureTextWidth(maxNavString, this.mainNav);
    }

    getMinWidth() {
        return this.minNavWidth;
    }

    setMinWidth(width) {
        this.mainNav.style.minWidth = width;
    }

    render() {
        const {model} = this.props;
        return <DivFlexFixed className="relative" refProp={e => this.mainNav = e}>
            <DivPaddingFill>
                <DivFlexColumn className="full_height">
                    {
                        navStruct.map((item, index) =>
                            <LocationMatch if={item.path + "(/:id)"}
                                           then={NavSelected(model[item.modelKey], index)}
                                           else={NavClear(index)}
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
        model: state.model
    }
}

export default connect(stateToNav)(Nav);