/**
 * Created by anton on 16.02.17.
 */
import React, {PropTypes} from 'react';
import {DivFlexFixed, DivFlexRow, DivFlexStretchFill, DivFlexStretch} from '../Layout.jsx';

export default class InputOnClick extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false,
            initialValue: this.props.value || "",
            value: this.props.value || "",
            storedValue: this.props.value || "",
        }
        this.lastSubmitValue = this.props.value || "";
        this.inputProps = {};
        if (this.props.style)
            this.inputProps.style = this.props.style;
        if (this.props.className)
            this.inputProps.className = this.props.className;
        this.lastKey = '';
    }

    valueOf() {
        return this.state.value;
    }

    toString() {
        return this.state.value;
    }

    handleChange(e) {
        this.setState({value: e.target.value});
        if (this.props.onChange) this.props.onChange(e.target.value);
    }

    handleInput(event) {
        let key = event.key;
        if (this.lastKey !== key && key === 'Enter') {
            event.preventDefault();
            this.setState({isActive: false});
            this.handleSubmit();
        } else if (key == 'Escape' || key == 'Esc' || event.keyCode == 27) {
            event.preventDefault();
            this.setState({
                isActive: false,
                value: this.state.storedValue,
            });
        }
        this.lastKey = key;
    }

    handleSubmit(event) {
        if (event)
            event.preventDefault();
        if (this.state.value === this.lastSubmitValue)
            return;
        this.lastSubmitValue = this.state.value;
        console.log("chatInput: %o", this.state.value);
        if (this.props.onSubmit)
            this.props.onSubmit(this.state.value);
        this.setState({storedValue: this.state.value});
    }

    render() {
        let divStyle = {
            display: "inline-block",
            position: "relative"
        };
        if (this.inputProps.style.width)
            divStyle.width = this.inputProps.style.width;
        return <div style={divStyle}
                    onClick={(e) => {
                        e.preventDefault();
                        this.setState({
                            isActive: true,
                            storedValue: this.state.value,
                        });
                        setTimeout(() => this.input.focus(), 0);
                    }}>
            <input type="text" {...this.inputProps}
                   disabled={!this.state.isActive}
                   value={this.state.value}
                   onChange={(e) => this.handleChange(e)}
                   ref={(r) => this.input = r}
                   onKeyDown={(e) => {
                       this.handleInput(e)
                   }}
                   onBlur={(e) => {
                       this.setState({isActive: false});
                       this.handleSubmit(e)
                   }}
            />
        </div>;
    }
}