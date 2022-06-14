import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import { connect } from 'react-redux';
import { deleteInvitee, setInviteeRole } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  me: state.data.me,
  spaceMembers: state.data.spaceMembers
});

function Invitee(props) {
  const { invitee, inviteeId } = props;
  const { spaceMembers, me } = props;
  const [permittedRoles, setPermittedRoles] = useState([]);
  const iAmAdmin =
    (spaceMembers[me._id || me.member] !== undefined &&
      spaceMembers[me._id || me.member].role === 'admin') ||
    false;
  const iAmMember =
    (spaceMembers[me._id || me.member] !== undefined &&
      spaceMembers[me._id || me.member].role === 'member') ||
    false;

  useEffect(() => {
    iAmAdmin &&
      setPermittedRoles([
        { value: 'admin', label: 'Admin' },
        { value: 'member', label: 'Member' },
        { value: 'guest', label: 'Guest' }
      ]);
    iAmMember && setPermittedRoles([{ value: 'guest', label: 'Guest' }]);
  }, [spaceMembers, me, iAmMember, iAmAdmin]);

  return (
    <div className="invitee">
      <div className="row my-auto mx-auto">
        <span className="col my-auto">{invitee?.label || 'No invitees yet'}</span>
        {(iAmAdmin || iAmMember) && (
          <Select
            className="col my-auto"
            options={permittedRoles}
            onChange={(e) => props.setInviteeRole(inviteeId, e.value)}
            placeholder="Select a role..."
          />
        )}
        <Button
          variant="danger"
          onClick={() => {
            props.deleteInvitee(inviteeId);
          }}
        >
          ❌
        </Button>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, { deleteInvitee, setInviteeRole })(Invitee);
