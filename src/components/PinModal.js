import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setSpacePin, togglePinModal } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  showPinModal: state.data.showPinModal,
  spacePin: state.data.spacePin
});

function PinModal(props) {
  const { showPinModal, spacePin } = props;

  return (
    <div>
      <Modal
        show={showPinModal}
        dialogClassName="custom-dialog"
        animation={false}
        onHide={() => null}
      >
        <Modal.Header>
          <Modal.Title>Enter space PIN code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <br />
            <label htmlFor="authToken">PIN:</label>
            <input
              className="form-control"
              value={spacePin}
              onChange={(e) => props.setSpacePin(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <p>Once entered, click "Save Changes", then click "Join Space" </p>
          <Button
            variant="primary"
            disabled={!spacePin.length}
            onClick={() => {
              props.togglePinModal(false);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default connect(mapStateToProps, { setSpacePin, togglePinModal })(PinModal);
