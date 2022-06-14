import React, { useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { toggleModalSpaceInvite, inviteToSpace } from '../redux/actions/spaceActions';
import DMSearchBar from './DMSearchBar';
import Invitee from './Invitee';

const mapStateToProps = (state) => ({
  showModalSpaceInvite: state.data.showModalSpaceInvite,
  invitees: state.data.invitees
});

function ModalSpaceInvite(props) {
  const { showModalSpaceInvite, invitees } = props;

  useEffect(() => {
    console.log(invitees);
  }, [invitees]);

  return (
    <div>
      <Modal
        show={showModalSpaceInvite}
        dialogClassName="custom-dialog"
        animation={false}
        onHide={() => null}
      >
        <Modal.Header>
          <Modal.Title>Invite People</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DMSearchBar contactClickAction="addToInviteeList" />
          {invitees.map((invitee, idx) => (
            <Invitee invitee={invitee} key={idx} inviteeId={idx} />
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => props.inviteToSpace(invitees)}>
            Invite
          </Button>
          <Button variant="secondary" onClick={() => props.toggleModalSpaceInvite(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default connect(mapStateToProps, { toggleModalSpaceInvite, inviteToSpace })(
  ModalSpaceInvite
);
