import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setSpaceSettings, toggleModalSpaceSettings } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  showSpaceSettingsModal: state.data.showSpaceSettingsModal,
  spaceSettings: state.data.spaceSettings,
  conferenceCall: state.data.conferenceCall,
  currentVideoResolution: state.data.currentVideoResolution
});

function SpaceSettingsModal(props) {
  const { showSpaceSettingsModal, spaceSettings, conferenceCall } = props;
  const [resolutionValue, setResolutionValue] = useState(undefined);

  const resolutionOptions = [
    { name: '720p', value: '720P' },
    { name: '480p', value: '480P' },
    { name: '360p', value: '360P' },
    { name: 'Audio only', value: 'NONE' }
  ];

  useEffect(() => {
    console.log(spaceSettings);
    if (spaceSettings?.settings?.mpaasSettings?.maxResolution) {
      setResolutionValue(spaceSettings?.settings?.mpaasSettings?.maxResolution);
    }
  }, [conferenceCall, spaceSettings]);

  return (
    <div>
      <Modal
        show={showSpaceSettingsModal}
        size="lg"
        animation={false}
        onHide={() => {
          props.toggleModalSpaceSettings(!showSpaceSettingsModal);
          setResolutionValue(spaceSettings?.settings?.mpaasSettings?.maxResolution);
        }}
      >
        <Modal.Header>
          <Modal.Title>Space settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Video options</h5>
          <h6>SET THE MAXIMUM VIDEO QUALITY AVAILABLE FOR MEETINGS IN THIS SPACE</h6>
          <div className="row">
            <div className="col-6 mt-4">
              <ButtonGroup>
                {resolutionOptions.map((radio, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`radio-${idx}`}
                    type="radio"
                    variant="outline-success"
                    name="radio"
                    value={radio.value}
                    onChange={(e) => setResolutionValue(e.currentTarget.value)}
                    checked={
                      !resolutionValue
                        ? radio.value === spaceSettings?.settings?.mpaasSettings?.maxResolution
                        : radio.value === resolutionValue
                    }
                  >
                    {radio.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
              <p>
                <b>Note:</b> These changes will be applied the next time you start a meeting.
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => props.setSpaceSettings(resolutionValue)}>
            Save
          </Button>
          <Button
            variant="danger"
            onClick={() => props.toggleModalSpaceSettings(!showSpaceSettingsModal)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default connect(mapStateToProps, {
  setSpaceSettings,
  toggleModalSpaceSettings
})(SpaceSettingsModal);
