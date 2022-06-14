import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import './styles/neo-icons.css';
import './styles/neo.css';
import 'react-quill/dist/quill.snow.css';
import './styles/quill.mention.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-day-picker/lib/style.css';
import { Provider } from 'react-redux';
import jQuery from 'jquery';
import Konva from 'konva';
import xmlToJSON from 'xmltojson';
import SampleAvayaSpacesSDK from './assets/libs/SampleSDK/SampleAvayaSpacesSDK';
import store from './redux/store';
import App from './containers/App';

import {
  SET_ME,
  SET_PEOPLE_WITH_DM,
  SET_MY_SPACES,
  SET_SPACE_TITLE,
  SHOW_SUBSCRIBING_SPINNER,
  SET_CHANNEL_SUBSCRIBED,
  SET_SPACE_MEMBERS,
  SET_SPACE_POSTS,
  SET_SPACE_TASKS,
  SET_SPACE_MEETINGS,
  SET_CONFERENCE_CALL,
  SET_CAMERA_STATE,
  SET_MICROPHONE_STATE,
  SET_COLLEAGUES_AND_DM_LIST,
  SET_SPACE_ID,
  SET_PARTY_TYPING,
  SET_SPACE_CONTENT,
  SHOW_MODAL_POST_CREATE,
  SHOW_MODAL_TASK_CREATE,
  SET_MEETING_DATA,
  SHOW_CALL_PREVIEW,
  SET_USER_SETTINGS,
  SET_CAMERA_OPTIONS,
  SET_MIC_OPTIONS,
  SET_SPEAKER_OPTIONS,
  TOGGLE_RECORDING,
  TOGGLE_NOISE_REDUCTION,
  SHOW_JOINING_MEETING_SPINNER,
  SET_USER_RAISED_HAND,
  SET_SCREENSHARE,
  SHOW_MODAL_POST_EDIT,
  SHOW_MODAL_TASK_EDIT,
  SET_UPLOADED_FILE,
  SET_ATTACHMENTS_FEATURE,
  SHOW_MODAL_SPACE_SETTINGS,
  SET_SPACE_SETTINGS,
  SET_CURRENT_VIDEO_RESOLUTION,
  SHOW_MODAL_SPACE_INVITE,
  SHOW_MODAL_DIGITAL_CALL,
  SHOW_MODAL_INCOMING_CALL,
  SET_CALLER,
  SHOW_MODAL_PIN,
  SET_SPACE_PIN
} from './redux/actions/types';

window.xmlToJSON = xmlToJSON;
window.Konva = Konva;
window.$ = jQuery;
window.jQuery = jQuery;

window.SampleAvayaSpacesSDK = new SampleAvayaSpacesSDK();

window.SampleAvayaSpacesSDK.EventEmitter.subscribe('state', (passedState) => {
  Object.keys(passedState.data).map((stateName) => {
    const val = passedState.data[stateName];

    if (stateName === 'me') store.dispatch({ type: SET_ME, val });
    if (stateName === 'peopleWithDM') store.dispatch({ type: SET_PEOPLE_WITH_DM, val });
    if (stateName === 'mySpaces') store.dispatch({ type: SET_MY_SPACES, val });
    if (stateName === 'spaceTitle') store.dispatch({ type: SET_SPACE_TITLE, val });
    if (stateName === 'showSubscribingSpinner')
      store.dispatch({ type: SHOW_SUBSCRIBING_SPINNER, val });
    if (stateName === 'channelSubscribed') store.dispatch({ type: SET_CHANNEL_SUBSCRIBED, val });
    if (stateName === 'spaceMembers') store.dispatch({ type: SET_SPACE_MEMBERS, val });
    if (stateName === 'spacePosts') store.dispatch({ type: SET_SPACE_POSTS, val });
    if (stateName === 'spaceTasks') store.dispatch({ type: SET_SPACE_TASKS, val });
    if (stateName === 'spaceMeetings') store.dispatch({ type: SET_SPACE_MEETINGS, val });
    if (stateName === 'conferenceCall') store.dispatch({ type: SET_CONFERENCE_CALL, val });
    if (stateName === 'videoMuted') store.dispatch({ type: SET_CAMERA_STATE, val });
    if (stateName === 'audioMuted') store.dispatch({ type: SET_MICROPHONE_STATE, val });
    if (stateName === 'colleaguesAndDMList')
      store.dispatch({ type: SET_COLLEAGUES_AND_DM_LIST, val });
    if (stateName === 'spaceId') store.dispatch({ type: SET_SPACE_ID, val });
    if (stateName === 'partyTyping') store.dispatch({ type: SET_PARTY_TYPING, val });
    if (stateName === 'spaceContent') store.dispatch({ type: SET_SPACE_CONTENT, val });
    if (stateName === 'showModalPostCreate') store.dispatch({ type: SHOW_MODAL_POST_CREATE, val });
    if (stateName === 'showModalTaskCreate') store.dispatch({ type: SHOW_MODAL_TASK_CREATE, val });
    if (stateName === 'meetingData') store.dispatch({ type: SET_MEETING_DATA, val });
    if (stateName === 'showCallPreviewModal') store.dispatch({ type: SHOW_CALL_PREVIEW, val });
    if (stateName === 'showSpaceSettingsModal')
      store.dispatch({ type: SHOW_MODAL_SPACE_SETTINGS, val });
    if (stateName === 'userSettings') store.dispatch({ type: SET_USER_SETTINGS, val });
    if (stateName === 'cameraOptions') store.dispatch({ type: SET_CAMERA_OPTIONS, val });
    if (stateName === 'micOptions') store.dispatch({ type: SET_MIC_OPTIONS, val });
    if (stateName === 'speakersOptions') store.dispatch({ type: SET_SPEAKER_OPTIONS, val });
    if (stateName === 'recording') store.dispatch({ type: TOGGLE_RECORDING, val });
    if (stateName === 'showJoiningMeetingSpinner')
      store.dispatch({ type: SHOW_JOINING_MEETING_SPINNER, val });
    if (stateName === 'isNoiseReductionEnabled')
      store.dispatch({ type: TOGGLE_NOISE_REDUCTION, val });
    if (stateName === 'onScreenShare') store.dispatch({ type: SET_SCREENSHARE, val });
    if (stateName === 'userRaisedHand') store.dispatch({ type: SET_USER_RAISED_HAND, val });
    if (stateName === 'showModalPostEdit') store.dispatch({ type: SHOW_MODAL_POST_EDIT, val });
    if (stateName === 'showModalTaskEdit') store.dispatch({ type: SHOW_MODAL_TASK_EDIT, val });
    if (stateName === 'uploadedFile') store.dispatch({ type: SET_UPLOADED_FILE, val });
    if (stateName === 'attachmentFeatureDenied')
      store.dispatch({ type: SET_ATTACHMENTS_FEATURE, val });
    if (stateName === 'spaceSettings') store.dispatch({ type: SET_SPACE_SETTINGS, val });
    if (stateName === 'currentVideoResolution')
      store.dispatch({ type: SET_CURRENT_VIDEO_RESOLUTION, val });
    if (stateName === 'showModalSpaceInvite')
      store.dispatch({ type: SHOW_MODAL_SPACE_INVITE, val });
    if (stateName === 'showModalDigitalCall')
      store.dispatch({ type: SHOW_MODAL_DIGITAL_CALL, val });
    if (stateName === 'showIncomingCallModal')
      store.dispatch({ type: SHOW_MODAL_INCOMING_CALL, val });
    if (stateName === 'caller') store.dispatch({ type: SET_CALLER, val });
    if (stateName === 'showPinModal') store.dispatch({ type: SHOW_MODAL_PIN, val });
    if (stateName === 'spacePin') store.dispatch({ type: SET_SPACE_PIN, val });

    return null;
  });
});

const scriptLoader = () =>
  new Promise((resolve) => {
    import('./assets/libs/AvayaClientServices-4.9.0.44.min.js')
      .then(() => import('./assets/libs/AvayaClientServices.Renderer.min.js'))
      .then(() => {
        resolve(true);
      });
  });

scriptLoader().then((res) => {
  res === true &&
    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>,
      document.getElementById('root')
    );
});
