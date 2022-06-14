import './App.scss';
import { connect } from 'react-redux';
import toast, { Toaster as ToastNotification } from 'react-hot-toast';

import React, { Component } from 'react';

import Button from 'react-bootstrap/Button';
import {
  setErrorData,
  setZoom,
  toggleAuthModal,
  setAuthMethod,
  setEnvironment,
  revokeToken,
  refreshToken
} from '../redux/actions/spaceActions';
import SpaceContent from './SpaceContent';

import DeviceSelectionModal from '../components/DeviceSelectionModal';
import MeetingControls from '../components/MeetingControls';
import AuthWall from '../components/AuthWall';
import PinModal from '../components/PinModal';
import ModalPostCreate from '../components/ModalPostCreate';
import ModalPostEdit from '../components/ModalPostEdit';
import ModalTaskCreate from '../components/ModalTaskCreate';
import ModalTaskEdit from '../components/ModalTaskEdit';
import DigitalCallModal from '../components/DigitalCallModal';
import SpaceMembersList from '../components/SpaceMembersList';
import StorageDashboard from '../components/StorageDashboard';
import DirectMessages from '../components/DirectMessages';
import UserSpaces from '../components/UserSpaces';
import IncomingCallModal from '../components/IncomingCallModal';
import ModalSpaceInvite from '../components/ModalSpaceInvite';

import CallPreviewModal from './CallPreviewModal';
import SpaceSettingsModal from './SpaceSettingsModal';
import LayoutOptionsModal from '../components/LayoutOptionsModal';
import no_media from '../assets/img/no_media.png';

const mapStateToProps = (state) => ({
  me: state.data.me,
  peopleWithDM: state.data.peopleWithDM,
  contentSharingRendererZoom: state.data.contentSharingRendererZoom
});

export class App extends Component {
  constructor(props) {
    super(props);
    this.videoGrid = document.getElementById('video-grid');
    this.myVideo = document.createElement('video');
    this.myVideo.muted = true;
  }

  componentDidMount() {
    const QUERY_STRING = window.location.search;
    const URL_PARAMS = new URLSearchParams(QUERY_STRING);
    const CODE_IN_URL = URL_PARAMS.has('code');
    const AUTH_CODE_FLOW_CREDENTIALS_PRESENT =
      sessionStorage.getItem('client_id') &&
      sessionStorage.getItem('client_secret') &&
      sessionStorage.getItem('spaceId');

    if (CODE_IN_URL) {
      if (!AUTH_CODE_FLOW_CREDENTIALS_PRESENT) {
        window.location = 'http://localhost:3000';
      }
      if (AUTH_CODE_FLOW_CREDENTIALS_PRESENT) {
        sessionStorage.setItem('code', URL_PARAMS.get('code'));
        this.props.toggleAuthModal(false);
        this.props.setAuthMethod('authorizationCode');
      }
    }

    // Notification event listeners
    window.SampleAvayaSpacesSDK.EventEmitter.subscribe('error', (event) => {
      toast.error(event.message);
    });
    window.SampleAvayaSpacesSDK.EventEmitter.subscribe('success', (event) => {
      toast.success(event.message);
    });

    this.props.setEnvironment();
  }

  // displayErrorAlert = (event) => {
  //   this.setState({
  //     showErrorAlert: true,
  //     errorMessage: event.message,
  //     errorData: JSON.stringify(event.data, null, 2)
  //   });
  // };

  render() {
    const { me, contentSharingRendererZoom, peopleWithDM } = this.props;
    const LOGGED_IN_USING_OAUTH_FLOW = localStorage.getItem('refresh_token');

    return (
      <div className="App">
        <span className="float-right">
          Logged in as:{' '}
          {me?.username ? (
            <>
              <p>{me?.username}</p>
              {LOGGED_IN_USING_OAUTH_FLOW && (
                <Button variant="danger" onClick={() => this.props.revokeToken()}>
                  Revoke Token
                </Button>
              )}
              {/* <Button onClick={() => this.props.refreshToken()}>Refresh Token</Button> */}
            </>
          ) : (
            <Button variant="warning" onClick={() => this.setState({ showAuthModal: true })}>
              Authorize
            </Button>
          )}
        </span>
        {/* NOTIFICATIONS */}

        <ToastNotification reverseOrder toastOptions={{ duration: 6000 }} position="top-left" />

        {/* MODALS */}
        <AuthWall />
        <PinModal />
        <CallPreviewModal />
        <ModalPostCreate />
        <ModalPostEdit />
        <ModalTaskCreate />
        <ModalTaskEdit />
        <DeviceSelectionModal />
        <SpaceSettingsModal />
        <LayoutOptionsModal />
        <ModalSpaceInvite />
        <DigitalCallModal />
        <IncomingCallModal />

        <h1>Sample Space App</h1>
        <div className="row">
          <div className="col-6">
            <h4>Stored application data:</h4>
            <StorageDashboard />
          </div>
          <div className="col-6">
            <h4>Your camera preview:</h4>
            <video autoPlay id="localVideoElement" height="400" width="500" ref={this.textInput} />
            <MeetingControls />
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-3">
            <h4>Space members:</h4>
            <SpaceMembersList />
            <br />
            {peopleWithDM && Object.keys(peopleWithDM).length ? <DirectMessages /> : null}
          </div>
          <div className="col-6">
            <h4>Meeting video and chat:</h4>
            <video autoPlay id="remoteVideoElement" height="350" width="600" poster={no_media} />
            <SpaceContent />
          </div>
          <div className="col-3">
            <h4>User spaces:</h4>
            <UserSpaces />
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-12">
            <h4>Screensharing frame:</h4>
            <p>Current size: {contentSharingRendererZoom * 100}%</p>
            <span onClick={() => setZoom(contentSharingRendererZoom + 0.25)}>
              <Button>+</Button>
            </span>
            <span onClick={() => setZoom(contentSharingRendererZoom - 0.25)}>
              <Button>-</Button>
            </span>
            <div id="screenReceiveFrame" />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, {
  setErrorData,
  setZoom,
  toggleAuthModal,
  setAuthMethod,
  setEnvironment,
  revokeToken,
  refreshToken
})(App);
