import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React from 'react';
import { connect } from 'react-redux';
import { toggleDevicesModal } from '../redux/actions/spaceActions';
import DeviceSelectionBody from './DeviceSelectionBody';

const mapStateToProps = (state) => ({ showDevicesModal: state.data.showDevicesModal });

function DeviceSelectionModal(props) {
  const { showDevicesModal } = props;

  return (
    <Modal
      show={showDevicesModal}
      onHide={() => props.toggleDevicesModal(!showDevicesModal)}
      animation={false}
      closeButton
    >
      <Modal.Header>
        <Modal.Title>Device settings</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <DeviceSelectionBody />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => props.toggleDevicesModal(!showDevicesModal)}>
          Close
        </Button>
        <Button variant="primary" onClick={() => props.toggleDevicesModal(!showDevicesModal)}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default connect(mapStateToProps, { toggleDevicesModal })(DeviceSelectionModal);
