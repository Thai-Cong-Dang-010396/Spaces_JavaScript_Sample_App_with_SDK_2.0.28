import React, { useState, useEffect } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Modal from 'react-bootstrap/Modal';
import { Tab, Button, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  setAuthMethod,
  toggleAuthModal,
  setEnvironment,
  setInvitationAuthorization,
  setToken,
  setSpaceId,
  setClientId,
  setClientSecret,
  setUsername,
  setPassword,
  setAnonUsername,
  setSpacePin,
  setInviteLink,
  getSpaceInfoFromInviteLink
} from '../redux/actions/spaceActions';

const mapStateToProps = (state) => {
  const {
    token,
    anonUsername,
    showAuthModal,
    client_id,
    client_secret,
    env,
    username,
    invitationAuth,
    inviteLink,
    spaceId,
    spacePin,
    password
  } = state.data;

  return {
    token,
    anonUsername,
    showAuthModal,
    client_id,
    client_secret,
    env,
    username,
    invitationAuth,
    inviteLink,
    spaceId,
    spacePin,
    password
  };
};

function AuthWall(props) {
  const {
    token,
    spaceId,
    anonUsername,
    client_id,
    client_secret,
    username,
    password,
    inviteLink,
    invitationAuth,
    spacePinRequired,
    showAuthModal,
    env,
    spacePin
  } = props;
  const [eventKey, setEventKey] = useState('jwtToken');
  const [buttonsDisabled, setButtonsDisabled] = useState(true);

  useEffect(() => {
    if (eventKey === 'jwtToken') {
      if (token === '' || spaceId === '') {
        setButtonsDisabled(true);
      } else setButtonsDisabled(false);
    }
    if (eventKey === 'authorizationCode') {
      if (client_id === '' || client_secret === '' || spaceId === '') {
        setButtonsDisabled(true);
      } else return setButtonsDisabled(false);
    }
    if (eventKey === 'anonToken') {
      if (anonUsername === '' || spaceId === '') {
        setButtonsDisabled(true);
      } else return setButtonsDisabled(false);
    }
    if (eventKey === 'password') {
      if (
        client_id === '' ||
        client_secret === '' ||
        spaceId === '' ||
        username === '' ||
        password === ''
      ) {
        setButtonsDisabled(true);
      } else return setButtonsDisabled(false);
    }
    if (eventKey === 'invitation') {
      if (
        inviteLink === '' ||
        (invitationAuth === 'anonInvitation' && anonUsername === '' && spaceId === '') ||
        (invitationAuth === 'jwtInvitation' && token === '')
      ) {
        setButtonsDisabled(true);
      } else return setButtonsDisabled(false);
    }
  }, [
    spaceId,
    token,
    client_id,
    anonUsername,
    client_secret,
    username,
    password,
    invitationAuth,
    inviteLink,
    eventKey
  ]);

  return (
    <div>
      <Modal
        show={showAuthModal}
        dialogClassName="custom-dialog"
        animation={false}
        onHide={() => null}
      >
        <Modal.Header>
          <Modal.Title>Authorization modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            defaultActiveKey="jwtToken"
            onSelect={function (k) {
              setEventKey(k);
            }}
            transition={false}
          >
            <Tab eventKey="jwtToken" title="JWT Token">
              <div className="form-group">
                <br />
                <label htmlFor="authToken">Your authorization token:</label>
                <input
                  className="form-control"
                  id="authToken"
                  value={token}
                  onChange={(e) => props.setToken(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="rn_1">Room Number:</label>
                <input
                  className="form-control"
                  id="rn_1"
                  value={spaceId}
                  onChange={(e) => props.setSpaceId(e.target.value)}
                />
              </div>
              <label>Environment: </label>
              <br />
              <ToggleButtonGroup
                type="radio"
                value={env}
                onChange={(val) => props.setEnvironment(val)}
                name="options"
                defaultValue={env}
              >
                <ToggleButton value="staging" variant="info">
                  Staging
                </ToggleButton>
                <ToggleButton value="production" variant="info">
                  Production
                </ToggleButton>
              </ToggleButtonGroup>
            </Tab>

            <Tab eventKey="authorizationCode" title="Authorization code (OAuth)">
              <div className="form-group">
                <br />
                <label htmlFor="client_id_1">Client ID:</label>
                <input
                  className="form-control"
                  id="client_id_1"
                  value={client_id}
                  onChange={(e) => props.setClientId(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="client_secret">Client secret:</label>
                <input
                  className="form-control"
                  id="client_secret"
                  value={client_secret}
                  onChange={(e) => props.setClientSecret(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="rn_2">Room Number:</label>
                <input
                  className="form-control"
                  id="rn_2"
                  value={spaceId}
                  onChange={(e) => props.setClientId(e.target.value)}
                />
              </div>
              <label>Environment: </label>
              <br />
              <ToggleButtonGroup
                type="radio"
                value={env}
                onChange={(val) => props.setEnvironment(val)}
                name="options"
                defaultValue={env}
              >
                <ToggleButton value="staging" variant="info">
                  Staging
                </ToggleButton>
                <ToggleButton value="production" variant="info">
                  Production
                </ToggleButton>
              </ToggleButtonGroup>
            </Tab>

            <Tab eventKey="password" title="Password (OAuth)">
              <div className="form-group">
                <br />
                <label htmlFor="client_id_2">Client ID:</label>
                <input
                  className="form-control"
                  id="client_id_2"
                  value={client_id}
                  onChange={(e) => props.setClientId(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="client_secret_1">Client secret:</label>
                <input
                  className="form-control"
                  id="client_secret_1"
                  value={client_secret}
                  onChange={(e) => props.setClientSecret(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  className="form-control"
                  id="username"
                  value={username}
                  placeholder="username@company.org"
                  onChange={(e) => props.setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  className="form-control"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => props.setPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="rn_3">Room Number:</label>
                <input
                  className="form-control"
                  id="rn_3"
                  value={spaceId}
                  onChange={(e) => props.setSpaceId(e.target.value)}
                />
              </div>
              <label>Environment: </label>
              <br />
              <ToggleButtonGroup
                type="radio"
                value={env}
                onChange={(val) => props.setEnvironment(val)}
                name="options"
                defaultValue={env}
              >
                <ToggleButton value="staging" variant="info">
                  Staging
                </ToggleButton>
                <ToggleButton value="production" variant="info">
                  Production
                </ToggleButton>
              </ToggleButtonGroup>
            </Tab>

            <Tab eventKey="anonToken" title="Anonymous Token (Guest user)">
              <div className="form-group">
                <br />
                <label htmlFor="anonUsername1">Username:</label>
                <input
                  className="form-control"
                  id="anonUsername1"
                  value={anonUsername}
                  onChange={(e) => props.setAnonUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="rn2">Room Number:</label>
                <input
                  className="form-control"
                  id="rn2"
                  value={spaceId}
                  onChange={(e) => props.setSpaceId(e.target.value)}
                />
              </div>
              <label>Environment: </label>
              <br />
              <ToggleButtonGroup
                type="radio"
                value={env}
                onChange={(val) => props.setEnvironment(val)}
                name="options"
                defaultValue={env}
              >
                <ToggleButton value="staging" variant="info">
                  Staging
                </ToggleButton>
                <ToggleButton value="production" variant="info">
                  Production
                </ToggleButton>
              </ToggleButtonGroup>
            </Tab>
            <Tab eventKey="invitation" title="Invitation link">
              <div className="form-group">
                <br />
                <label htmlFor="inviteLink">1) Paste your invitation link:</label>
                <input
                  className="form-control"
                  id="inviteLink"
                  value={inviteLink}
                  onChange={(e) => props.setInviteLink(e.target.value)}
                />
                <br />
                2) Choose an authorization method:
                <br />
                <ToggleButtonGroup
                  type="radio"
                  value={invitationAuth}
                  onChange={(val) => props.setInvitationAuthorization(val)}
                  name="options"
                  defaultValue="anonInvitation"
                >
                  <ToggleButton value="jwtInvitation" variant="info">
                    JWT Token
                  </ToggleButton>
                  <ToggleButton value="anonInvitation" variant="info">
                    Anonymous
                  </ToggleButton>
                </ToggleButtonGroup>
                <br />
                <br />
                {invitationAuth === 'jwtInvitation' && (
                  <>
                    <label htmlFor="authToken">3) Paste your authorization token:</label>
                    <input
                      className="form-control"
                      id="authToken"
                      value={token}
                      onChange={(e) => props.setToken(e.target.value)}
                    />
                  </>
                )}
                {invitationAuth === 'anonInvitation' && (
                  <>
                    <label htmlFor="anonUsername2">3) Pick any username:</label>
                    <input
                      className="form-control"
                      id="anonUsername2"
                      value={anonUsername}
                      onChange={(e) => props.setAnonUsername(e.target.value)}
                    />
                  </>
                )}
                <br />
                4) Click:
                <br />
                {spacePinRequired && (
                  <>
                    <label htmlFor="spacePin">
                      5) Enter your space password and click "Get Space ID":
                    </label>
                    <input
                      className="form-control"
                      id="spacePin"
                      value={spacePin}
                      onChange={(e) => props.setSpacePin(e.target.value)}
                    />
                  </>
                )}
                <Button
                  variant="info"
                  onClick={() =>
                    props.getSpaceInfoFromInviteLink({
                      inviteLink,
                      invitationAuth,
                      anonUsername,
                      token,
                      spacePin
                    })
                  }
                >
                  Get Space ID
                </Button>
                <span>{spaceId}</span>
                <br />
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            disabled={buttonsDisabled}
            onClick={() => {
              props.toggleAuthModal(false);
              props.setAuthMethod(eventKey);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default connect(mapStateToProps, {
  setAuthMethod,
  toggleAuthModal,
  setEnvironment,
  setInvitationAuthorization,
  setToken,
  setSpaceId,
  setClientId,
  setClientSecret,
  setUsername,
  setPassword,
  setAnonUsername,
  setSpacePin,
  setInviteLink,
  getSpaceInfoFromInviteLink
})(AuthWall);
