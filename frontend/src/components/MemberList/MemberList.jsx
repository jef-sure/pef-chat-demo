"use strict";
import React, {PropTypes} from 'react';
import {measureTextWidth} from '../../lib/measure_text_width';
import {DivFlexColumn, DivFlexFixed, DivFlexRow, DivFlexStretch, DivPaddingFill} from '../Layout.jsx';
import {Link} from '../HashRouter.jsx';
import jpath from '../../lib/jpath';

export default class MemberList extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.recalcMinWidth();
        this.forceUpdate = () => this.recalcMinWidth();
        window.addEventListener('resize', this.forceUpdate);
    }

    componentWillReceiveProps(nextProps) {
        console.log("MemberList will receive props: ", nextProps);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.forceUpdate)
    }

    componentDidUpdate() {
        this.recalcMinWidth();
    }

    recalcMinWidth() {
        const {member_list, members} = this.props;
        let maxNavString = member_list.reduce((a, c) => {
            let u = jpath(members, (m) => m.id === c, '0/login');
            return (u.length > a.length) ? u : a;
        }, "WWWWWWW");
        maxNavString += "WWWWW";
        this.minNavWidth = Math.min(measureTextWidth(maxNavString, this.memberList), document.documentElement.clientWidth / 3);
        this.setMinWidth(this.minNavWidth + 'px');
    }

    getMinWidth() {
        return this.minNavWidth;
    }

    setMinWidth(width) {
        this.memberList.style.minWidth = width;
    }

    render() {
        const {member_list, members} = this.props;
        return <DivFlexFixed className="relative" refProp={e => this.memberList = e}>
            <DivPaddingFill>
                <DivFlexColumn className="full_height">
                    <DivFlexColumn className="flex_stretch">
                        <table style={{alignSelf: "center"}}>
                            <thead>
                            <tr>
                                <th>Members</th>
                            </tr>
                            </thead>
                        </table>
                        <DivFlexStretch className="vscroll_auto">
                            <ul className="main_nav_sub_list">
                                {
                                    member_list.map((item, index) =>
                                        <li className="list_no_wraps_no_discs" key={item}>
                                            <Link className="main_nav_sub_item"
                                                  to={"/member/" + item}>
                                                {jpath(members, (m) => m.id === item, '0/login')}
                                            </Link>
                                        </li>
                                    )
                                }
                            </ul>
                        </DivFlexStretch>
                    </DivFlexColumn>
                </DivFlexColumn>
            </DivPaddingFill>
        </DivFlexFixed>;
    }
}