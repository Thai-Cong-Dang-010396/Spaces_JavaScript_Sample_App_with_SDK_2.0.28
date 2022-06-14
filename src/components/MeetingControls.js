import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { connect } from 'react-redux';
import videoOn from '../assets/img/video-on.png';
import videoOff from '../assets/img/video-off.png';
import audioOn from '../assets/img/audio-on.png';
import audioOff from '../assets/img/audio-off.png';
import callStart from '../assets/img/call-start.png';
import callEnd from '../assets/img/call-end.png';
import screenshareOff from '../assets/img/screenshare-off.png';
import screenshareOn from '../assets/img/screenshare-on.png';
import recordingStart from '../assets/img/recording-on.png';
import recordingEnd from '../assets/img/recording-off.png';
import settings from '../assets/img/settings.png';
import spaceLeave from '../assets/img/space-leave.png';
import spaceEnter from '../assets/img/space-enter.png';

import {
  toggleConnectingSpinner,
  toggleDevicesModal,
  toggleMicrophone,
  toggleCamera,
  popCurrentSpace,
  preJoinSpace,
  toggleScreenShare,
  toggleRecording,
  presetCall,
  leaveMeeting,
  endMeeting,
  toggleNoiseReduction,
  toggleLayoutModal,
  setVideoResolution,
  setBackgroundBlur,
  setBackgroundImage,
  stopBackground
} from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  showDevicesModal: state.data.showDevicesModal,
  spaceId: state.data.spaceId,
  token: state.data.token,
  showSubscribingSpinner: state.data.showSubscribingSpinner,
  authMethodChosen: state.data.authMethodChosen,
  anonUsername: state.data.anonUsername,
  client_id: state.data.client_id,
  client_secret: state.data.client_secret,
  username: state.data.username,
  password: state.data.password,
  channelSubscribed: state.data.channelSubscribed,
  onScreenShare: state.data.onScreenShare,
  videoMuted: state.data.videoMuted,
  recording: state.data.recording,
  audioMuted: state.data.audioMuted,
  conferenceCall: state.data.conferenceCall,
  me: state.data.me,
  spaceMembers: state.data.spaceMembers,
  isNoiseReductionEnabled: state.data.isNoiseReductionEnabled,
  showJoiningMeetingSpinner: state.data.showJoiningMeetingSpinner,
  showLayoutModal: state.data.showLayoutModal,
  spaceSettings: state.data.spaceSettings,
  spacePin: state.data.spacePin,
  currentBackground: state.data.currentBackground,
  backgroundBlurCapability: state.data.backgroundBlurCapability,
  backgroundImageCapability: state.data.backgroundImageCapability
});

function MeetingControls(props) {
  const {
    spaceId,
    token,
    authMethodChosen,
    anonUsername,
    client_id,
    client_secret,
    channelSubscribed,
    showSubscribingSpinner,
    showDevicesModal,
    username,
    password,
    conferenceCall,
    videoMuted,
    audioMuted,
    onScreenShare,
    recording,
    spaceMembers,
    me,
    isNoiseReductionEnabled,
    showJoiningMeetingSpinner,
    showLayoutModal,
    spaceSettings,
    spacePin,
    currentBackground,
    backgroundBlurCapability,
    backgroundImageCapability
  } = props;

  const [resolutionOptions, setResolutionOptions] = useState([
    { name: '720p', value: '720P' },
    { name: '480p', value: '480P' },
    { name: '360p', value: '360P' },
    { name: 'Audio only', value: 'NONE' }
  ]);

  const [audioOnly, setAudioOnly] = useState(false);

  useEffect(() => {
    console.log(spaceSettings?.settings?.mpaasSettings?.maxResolution);
    if (spaceSettings?.settings?.mpaasSettings?.maxResolution && resolutionOptions.length > 2) {
      const filtered = resolutionOptions.filter(
        (item) =>
          item.value === 'NONE' ||
          item.value === spaceSettings?.settings?.mpaasSettings?.maxResolution
      );

      console.log(filtered);
      setResolutionOptions(filtered);
    }
    if (spaceSettings?.settings?.mpaasSettings?.maxResolution === 'NONE' && audioOnly === false) {
      setAudioOnly(true);
    } else setAudioOnly(false);
  }, [spaceSettings, resolutionOptions, audioOnly]);

  useEffect(() => {}, [spacePin]);

  const iAmAdmin =
    (spaceMembers[me._id || me.member] !== undefined &&
      spaceMembers[me._id || me.member].role === 'admin') ||
    false;

  return (
    <div>
      {channelSubscribed ? (
        <Button
          variant="danger"
          disabled={!channelSubscribed}
          id="closeConnection"
          onClick={() => props.popCurrentSpace()}
        >
          <img src={spaceLeave} alt="leave" /> Leave Space
        </Button>
      ) : (
        <Button
          variant="success"
          id="connectSocket"
          onClick={() => {
            props.preJoinSpace({
              spaceId,
              token,
              authMethodChosen,
              client_id,
              client_secret,
              anonUsername,
              username,
              password,
              spacePin
            });
            props.toggleConnectingSpinner(true);
          }}
        >
          <span>
            <img src={spaceEnter} alt="enter" /> Join Space
            {showSubscribingSpinner && (
              <Spinner animation="border" variant="light" size="sm" className="ml-1" />
            )}
          </span>
        </Button>
      )}

      {conferenceCall ? (
        iAmAdmin ? (
          <Dropdown className="btn">
            <Dropdown.Toggle variant="danger" className="btn">
              Leave Meeting
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => props.popCurrentSpace()}>Leave</Dropdown.Item>
              <Dropdown.Item onClick={() => props.endMeeting()}>End Meeting</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Button
            disabled={!channelSubscribed}
            onClick={() => props.leaveMeeting()}
            variant="danger"
          >
            <img src={callEnd} alt="disconnect" />
            Leave Meeting
          </Button>
        )
      ) : (
        <Button disabled={!channelSubscribed} onClick={() => props.presetCall()} variant="success">
          <img src={callStart} alt="connect" />
          Start Meeting{' '}
          {showJoiningMeetingSpinner && (
            <Spinner animation="border" variant="light" size="sm" className="ml-1" />
          )}
        </Button>
      )}
      {videoMuted ? (
        <Button variant="success" disabled={audioOnly} onClick={() => props.toggleCamera(true)}>
          <img src={videoOn} alt="videoOn" />
          Enable Camera{' '}
        </Button>
      ) : (
        <Button disabled={audioOnly} variant="danger" onClick={() => props.toggleCamera(false)}>
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

      {onScreenShare ? (
        <Button
          variant="danger"
          disabled={!channelSubscribed}
          onClick={() => props.toggleScreenShare(!onScreenShare)}
        >
          <img src={screenshareOff} alt="screenshareOff" />
          Stop screensharing
        </Button>
      ) : (
        <Button
          variant="success"
          disabled={!conferenceCall}
          onClick={() => props.toggleScreenShare(!onScreenShare)}
        >
          <img src={screenshareOn} alt="screenshareOn" />
          Start screensharing
        </Button>
      )}

      {recording ? (
        <Button
          variant="danger"
          disabled={!conferenceCall}
          onClick={() => props.toggleRecording(!recording)}
        >
          <img src={recordingEnd} alt="recordingEnd" />
          Stop recording
        </Button>
      ) : (
        <Button
          variant="light"
          disabled={!conferenceCall}
          onClick={() => props.toggleRecording(!recording)}
        >
          <img src={recordingStart} alt="recordingStart" />
          Start recording
        </Button>
      )}

      <Button
        disabled={!channelSubscribed}
        onClick={() => props.toggleDevicesModal(!showDevicesModal)}
      >
        <img src={settings} alt="settings" />
        Device settings
      </Button>

      {conferenceCall && (
        <Dropdown className="btn">
          <Dropdown.Toggle variant="success" className="btn">
            Video quality
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {resolutionOptions.map((item, i) => (
              <Dropdown.Item key={i} onClick={() => props.setVideoResolution(item.value)}>
                {item.value}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
      <Button
        disabled={!channelSubscribed}
        onClick={() => props.toggleDevicesModal(!showDevicesModal)}
      >
        <img src={settings} alt="settings" />
        Device settings
      </Button>
      <Button disabled={!conferenceCall} onClick={() => props.toggleLayoutModal(!showLayoutModal)}>
        {' '}
        Change Layout
      </Button>
      {conferenceCall && (
        <div className="bg-light btn pl-5">
          <input
            className="form-check-input"
            checked={isNoiseReductionEnabled}
            type="checkbox"
            id="isNoiseReductionEnabled"
            onChange={() => props.toggleNoiseReduction(isNoiseReductionEnabled)}
          />
          <label className="form-check-label" htmlFor="isNoiseReductionEnabled">
            Enable AI noise reduction
          </label>
        </div>
      )}
      {conferenceCall && (
        <Dropdown
          className="btn"
          disabled={!backgroundBlurCapability.isAllowed || !backgroundImageCapability.isAllowed}
        >
          <Dropdown.Toggle>Virtual Background</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                props.stopBackground(currentBackground);
              }}
            >
              Off
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                props.setBackgroundBlur();
              }}
            >
              Blur
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                props.setBackgroundImage();
              }}
            >
              Image
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
}

export default connect(mapStateToProps, {
  toggleConnectingSpinner,
  toggleDevicesModal,
  toggleLayoutModal,
  toggleMicrophone,
  toggleCamera,
  popCurrentSpace,
  preJoinSpace,
  toggleScreenShare,
  toggleRecording,
  presetCall,
  leaveMeeting,
  endMeeting,
  toggleNoiseReduction,
  setVideoResolution,
  setBackgroundBlur,
  setBackgroundImage,
  stopBackground
})(MeetingControls);
