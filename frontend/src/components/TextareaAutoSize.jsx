import React, {PropTypes} from 'react'

export default class TextareaAutoSize extends React.Component {
    constructor(props) {
        super(props);
        this.syncHeight = this.props.syncHeight;
    }

    recalcHeight() {
        var borders = 2;
        var innerHeight = Math.floor(this.textarea.scrollHeight / 2) * 2 + 1;
        this.textarea.style.height = (innerHeight + borders) + 'px';
        if (this.syncHeight)
            this.syncHeight(this.textarea.style.height);
    }

    componentDidMount() {
        if (this.delayedValue) {
            this.setState({value: this.delayedValue});
            delete this.delayedValue;
        }
        this.recalcHeight();
    }

    handleChange(e) {
        this.textarea.style.height = 0;
        this.recalcHeight();
        if (this.props.onChange) this.props.onChange(e.target.value);
    }

    setState({value}) {
        if (!this.textarea) {
            this.delayedValue = value;
        } else if (this.textarea.value !== value) {
            this.textarea.value = value;
            this.handleChange({target: {value: value}});
        }
    }

    valueOf() {
        return this.textarea ? this.textarea.value : null;
    }

    toString() {
        return this.textarea ? this.textarea.value : null;
    }

    focus() {
        if (this.textarea)
            this.textarea.focus();
    }

    render() {
        let props = Object.assign({}, this.props);
        if ("syncHeight" in props)
            delete props.syncHeight;
        return <textarea
            {...props}
            ref={(t) => this.textarea = t}
            rows="1"
            onChange={(e) => this.handleChange(e)}
        />
    }
}