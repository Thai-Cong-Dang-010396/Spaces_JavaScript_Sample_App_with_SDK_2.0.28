import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { cancelDigitalCall } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  showModalDigitalCall: state.data.showModalDigitalCall,
  callee: state.data.callee
});

function DigitalCallModal(props) {
  const { showModalDigitalCall, callee } = props;

  return (
    <Modal
      show={showModalDigitalCall}
      dialogClassName="custom-dialog"
      animation={false}
      className="black_modal"
    >
      <Modal.Body>
        <div className="loader">
          Calling {callee?.displayname}
          <span className="loader__dot">.</span>
          <span className="loader__dot">.</span>
          <span className="loader__dot">.</span>
        </div>
        <br />
        Please wait while we connect you
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => props.cancelDigitalCall()}>
          Hang up
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default connect(mapStateToProps, { cancelDigitalCall })(DigitalCallModal);
