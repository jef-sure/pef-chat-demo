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
    }

    componentDidUpdate() {
        this.recalcMinWidth();
    }

    recalcMinWidth() {
        const {member_list, members} = this.props;
        let maxNavString = member_list.reduce((a, c) => {
            let u = jpath(members, (m) => m.id === c, '0/login');
            return (u.length > a.length) ? u : a;
        }, "WWWW");
        maxNavString += "WW";
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
                                <li className="list_no_wraps_no_discs">{
                                    member_list.map((item, index) =>
                                        <Link key={index + "-" + item}
                                              className="main_nav_sub_item"
                                              to={"/member/" + item}>
                                            {jpath(members, (m) => m.id === item, '0/login')}
                                        </Link>
                                    )
                                }
                                </li>
                            </ul>
                        </DivFlexStretch>
                    </DivFlexColumn>
                </DivFlexColumn>
            </DivPaddingFill>
        </DivFlexFixed>;
    }
}