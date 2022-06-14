import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { declineDigitalCall, acceptDigitalCall } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  showIncomingCallModal: state.data.showIncomingCallModal,
  caller: state.data.caller
});

function IncomingCallModal(props) {
  const { showIncomingCallModal, caller } = props;

  return (
    <Modal show={showIncomingCallModal}>
      <div className="row">
        <div className="col my-auto" align="center">
          <img src={caller?.sender?.picture_url} alt="caller" className="caller__avatar" />
        </div>
        <div className="col" align="center">
          <h3>{caller?.sender?.displayname || 'Test name'}</h3>
          <p>New Call</p>
          <div className="col">
            <Modal.Footer>
              <Button variant="danger" onClick={() => props.declineDigitalCall(caller)}>
                Decline
              </Button>
              <Button variant="success" onClick={() => props.acceptDigitalCall(caller)}>
                Accept
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default connect(mapStateToProps, { declineDigitalCall, acceptDigitalCall })(
  IncomingCallModal
);
