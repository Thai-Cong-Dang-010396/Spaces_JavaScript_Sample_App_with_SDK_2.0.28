import { Modal } from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
import { toggleLayoutModal } from '../redux/actions/spaceActions';
import LayoutOptions from './LayoutOptions';

const mapStateToProps = (state) => ({ showLayoutModal: state.data.showLayoutModal });

function LayoutOptionsModal(props) {
  const { showLayoutModal } = props;

  return (
    <Modal show={showLayoutModal} onHide={() => props.toggleLayoutModal(!showLayoutModal)}>
      <Modal.Header>
        <Modal.Title>Layout options</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LayoutOptions />
      </Modal.Body>
    </Modal>
  );
}

export default connect(mapStateToProps, { toggleLayoutModal })(LayoutOptionsModal);
