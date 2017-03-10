"use strict";
import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalClose,
    ModalBody,
    ModalFooter
} from 'react-modal-bootstrap';
import {connect} from 'react-redux'
import ModalNewChat from './ModalNewChat.jsx';

class ModalManager extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.activeModal === "ModalNewChat")
            return <ModalNewChat/>;
        else
            return null;
    }
}

function stateToModal(state) {
    return {
        activeModal: state.visual.activeModal
    }
}

export default connect(stateToModal)(ModalManager);
