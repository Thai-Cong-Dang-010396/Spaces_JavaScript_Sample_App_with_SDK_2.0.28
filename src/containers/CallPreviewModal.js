import React, { useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import DeviceSelectionBody from '../components/DeviceSelectionBody';

import videoOn from '../assets/img/video-on.png';
import videoOff from '../assets/img/video-off.png';
import audioOn from '../assets/img/audio-on.png';
import audioOff from '../assets/img/audio-off.png';

import {
  initiateSpacesCall,
  toggleCamera,
  toggleMicrophone,
  toggleUserSettings,
  toggleCallPreviewModal
} from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  showCallPreviewModal: state.data.showCallPreviewModal,
  videoMuted: state.data.videoMuted,
  audioMuted: state.data.audioMuted,
  userSettings: state.data.userSettings
});

function CallPreviewModal(props) {
  const { showCallPreviewModal, videoMuted, audioMuted, userSettings, remoteStream } = props;
  const { disablePreviewWhenJoin } = userSettings;

  useEffect(() => {
    if (showCallPreviewModal) {
      window.SampleAvayaSpacesSDK.getMicDevices();
      window.SampleAvayaSpacesSDK.getCameraDevices();
      window.SampleAvayaSpacesSDK.getSpeakerDevices();
    }
  }, [showCallPreviewModal]);

  return (
    <div>
      <Modal
        show={showCallPreviewModal}
        size="lg"
        animation={false}
        onHide={() => props.toggleCallPreviewModal(!showCallPreviewModal)}
      >
        <Modal.Header>
          <Modal.Title>Device settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-6">
              <h4>Your camera preview:</h4>
              {videoMuted && (
                <div className="video-off-placeholder">
                  <h5 className="video-off-placeholder--text">Your camera is blocked!</h5>{' '}
                </div>
              )}
              <video
                style={{ display: videoMuted ? 'none' : 'block' }}
                autoPlay
                id="previewVideoElement"
                height="380"
                width="380"
              />
              {videoMuted ? (
                <Button
                  variant="success"
                  disabled={!remoteStream}
                  onClick={() => props.toggleCamera(true)}
                >
                  <img src={videoOn} alt="videoOn" />
                  Enable Camera{' '}
                </Button>
              ) : (
                <Button
                  disabled={!remoteStream}
                  variant="danger"
                  onClick={() => props.toggleCamera(false)}
                >
                  <img src={videoOff} alt="videoOff" />
                  Block Camera
                </Button>
              )}

              {audioMuted ? (
                <Button variant="success" onClick={() => props.toggleMicrophone(true)}>
                  <img src={audioOn} alt="audioOn" />
                  Enable Microphone{' '}
                </Button>
              ) : (
                <Button variant="danger" onClick={() => props.toggleMicrophone(false)}>
                  <img src={audioOff} alt="audioOff" />
                  Mute Microphone
                </Button>
              )}
            </div>
            <div className="col-6">
              <DeviceSelectionBody />
              <br />
              <input
                type="checkbox"
                checked={disablePreviewWhenJoin === false}
                id="disablePreviewWhenJoin"
                onChange={() =>
                  props.toggleUserSettings({ disablePreviewWhenJoin, audioMuted, videoMuted })
                }
              />
              <label htmlFor="showPreviewModal"> Always show preview when joining meetings</label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => props.initiateSpacesCall()}>
            Join Meeting
          </Button>
          <Button
            variant="danger"
            onClick={() => props.toggleCallPreviewModal(!showCallPreviewModal)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default connect(mapStateToProps, {
  initiateSpacesCall,
  toggleCamera,
  toggleMicrophone,
  toggleUserSettings,
  toggleCallPreviewModal
})(CallPreviewModal);
