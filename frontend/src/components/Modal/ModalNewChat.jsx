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
import {makeChat} from '../../actions/chatOps';
import {modalCloseNewChat} from '../../actions/modal';


class ModalChat extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.name.focus();
    }

    render() {
        const onCancel = () => {
            this.props.dispatch(modalCloseNewChat())
        };
        return <Modal isOpen={this.props.isOpen} onRequestHide={onCancel}>
            <ModalHeader>
                <ModalClose onClick={onCancel}/>
                <ModalTitle>Modal title</ModalTitle>
            </ModalHeader>
            <form className="form-horizontal" onSubmit={
                (evt) => {
                    evt.preventDefault();
                    this.props.dispatch(makeChat(this.name.value, this.title.value));
                }
            }>
                <ModalBody>
                    <div className="form-group">
                        <label htmlFor="id_ModalChat_name" className="col-sm-1 control-label">Name</label>
                        <div className="col-sm-11">
                            <input type="text" id="id_ModalChat_name"
                                   name="name" placeholder="Chat name"
                                   className="form-control"
                                   required={true}
                                   ref={(r) => this.name = r}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="id_ModalChat_title" className="col-sm-1 control-label">Title</label>
                        <div className="col-sm-11">
                            <input type="text" id="id_ModalChat_title"
                                   name="title" placeholder="Chat title"
                                   className="form-control"
                                   required={true}
                                   ref={(r) => this.title = r}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="form-group">
                        <div className="col-sm-offset-1 col-sm-11">
                            <button className='btn btn-primary'>
                                Make chat
                            </button>
                            <button className='btn btn-default' onClick={onCancel}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </ModalFooter>
            </form>
        </Modal>
    }
}

/*
 <ModalBody>
 <div className="form-group">
 <label htmlFor="id_ModalChat_name" className="col-sm-2 control-label">Name</label>
 <div className="col-sm-10">
 <input type="text" id="id_ModalChat_name"
 name="name" placeholder="Chat name"
 className="form-control"
 required={true}
 ref={(r) => this.name = r}
 />
 </div>
 </div>
 <div className="form-group">
 <label htmlFor="id_ModalChat_title" className="col-sm-2 control-label">Title</label>
 <div className="col-sm-10">
 <input type="text" id="id_ModalChat_title"
 name="title" placeholder="Chat title"
 className="form-control"
 required={true}
 ref={(r) => this.title = r}
 />
 </div>
 </div>
 </ModalBody>
 <ModalFooter>
 <div className="form-group">
 <div className="col-sm-offset-2 col-sm-10">
 <button className='btn btn-primary'>
 Make chat
 </button>
 <button className='btn btn-default' onClick={onCancel}>
 Cancel
 </button>
 </div>
 </div>
 </ModalFooter>

 */

function stateToModalNewChat(state) {
    return {
        isOpen: state.visual.activeModal === "ModalNewChat"
    }
}

export default connect(stateToModalNewChat)(ModalChat);
