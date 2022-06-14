import {
  SET_ZOOM_SIZE,
  SHOW_AUTH_MODAL,
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
  SEND_MESSAGE,
  SHOW_MODAL_POST_CREATE,
  SHOW_MODAL_POST_EDIT,
  SHOW_MODAL_TASK_CREATE,
  SHOW_MODAL_TASK_EDIT,
  SHOW_MODAL_SPACE_INVITE,
  SEND_POST,
  SHOW_DEVICE_SELECTION_MODAL,
  TOGGLE_CAMERA,
  TOGGLE_MICROPHONE,
  JOIN_SPACE,
  GET_COLLEAGUES_AND_DM_LIST,
  SET_COLLEAGUES_AND_DM_LIST,
  JOIN_DIRECT_SPACE,
  POP_CURRENT_SPACE,
  PRE_JOIN_SPACE,
  SET_AUTH_METHOD,
  SET_INVITATION_AUTHORIZATION,
  SET_CAMERA_STATE,
  SET_MICROPHONE_STATE,
  SET_TOKEN,
  GET_SPACE_FROM_INVITE_LINK,
  SET_SPACE_ID,
  SET_CLIENT_ID,
  SET_CLIENT_SECRET,
  SET_USERNAME,
  SET_PASSWORD,
  SET_ANON_USERNAME,
  SET_SPACE_PIN,
  SET_INVITE_LINK,
  SET_ENVIRONMENT,
  SET_PARTY_TYPING,
  SET_SPACE_CONTENT,
  SEND_TASK,
  SHOW_CALL_PREVIEW,
  SET_MEETING_DATA,
  SET_END_MEETING,
  SET_USER_SETTINGS,
  SELECT_CAMERA,
  SELECT_MIC,
  SELECT_SPEAKERS,
  SET_CAMERA_OPTIONS,
  SET_MIC_OPTIONS,
  SET_SPEAKER_OPTIONS,
  TOGGLE_RECORDING,
  TOGGLE_NOISE_REDUCTION,
  SHOW_JOINING_MEETING_SPINNER,
  SET_SCREENSHARE,
  GET_SPACE_POSTS,
  GET_SPACE_TASKS,
  GET_SPACE_MEETINGS,
  SET_USER_RAISED_HAND,
  SEND_EDITED_POST,
  SET_UPLOADED_FILE,
  SET_ATTACHMENTS_FEATURE,
  DELETE_TASK,
  SHOW_MODAL_SPACE_SETTINGS,
  SET_SPACE_SETTINGS,
  SHOW_MODAL_LAYOUT,
  VIDEO_LAYOUT_TYPES,
  SET_CURRENT_LAYOUT,
  SET_CURRENT_VIDEO_RESOLUTION,
  REVOKE_TOKEN,
  REFRESH_TOKEN,
  SET_INVITEES,
  SET_INVITEE,
  DELETE_INVITEE,
  SET_INVITEE_ROLE,
  SHOW_MODAL_DIGITAL_CALL,
  SET_CALLEE,
  SHOW_MODAL_INCOMING_CALL,
  SET_CALLER,
  SHOW_ERROR_ALERT,
  SHOW_MODAL_PIN,
  SET_CURRENT_MEETING_VIDEO_BACKGROUND_THEME,
  VIDEO_BACKGROUND_THEME,
  SET_BACKGROUND,
  BACKGROUND_OPTION
} from '../../redux/actions/types';

const initialState = {
  // SPACE CONTENT
  spaceContent: [],
  spacePosts: [],
  spaceTasks: [],
  spaceMeetings: [],
  spaceMembers: {},
  mySpaces: [],
  me: '',
  activeSpeaker: '',
  spaceTitle: '',
  socketConnectionEstablished: true,
  partyTyping: false,
  userInfo: '',
  channelSubscribed: false,
  showSubscribingSpinner: false,
  contentSharingRendererZoom: 1,
  minZoomValue: 0.25, // i.e. 25%
  maxZoomValue: 2, // i.e. 200%,
  conferenceCall: null,
  conferenceType: '',
  client: null,
  anonUsername: '',
  peopleWithDM: {},
  colleaguesAndDMList: {},
  userRaisedHand: '',
  userSettings: '',
  meetingData: null,
  postCurrentlyEdited: undefined,
  taskCurrentlyEdited: undefined,
  spaceSettings: [],
  currentVideoResolution: undefined,
  invitees: [],
  callee: null,
  caller: null,

  // MESSAGE CONTENT
  uploadedFile: [],

  // AUTHORIZATION
  token: process.env.REACT_APP_TOKEN || '',
  client_id: process.env.REACT_APP_CLIENT_ID || '',
  client_secret: process.env.REACT_APP_CLIENT_SECRET || '',
  env: process.env.REACT_APP_ENVIRONMENT || 'staging',
  spaceId: process.env.REACT_APP_SPACE_ID || '',
  username: process.env.REACT_APP_USERNAME || '',
  password: process.env.REACT_APP_PASSWORD || '',
  authMethodChosen: 'jwtToken',
  connectionPayload: { query: `token=${process.env.REACT_APP_TOKEN}&tokenType=jwt` },
  spacePinRequired: false,
  showPinModal: false,
  invitationAuth: '',
  spacePin: '',
  inviteLink: '',

  // MODALS
  showErrorAlert: false,
  errorMessage: '',
  errorData: '',
  showDevicesModal: false,
  showAuthModal: true,
  showModalPostCreate: false,
  showModalPostEdit: false,
  showModalTaskCreate: false,
  showModalTaskEdit: false,
  showCallPreviewModal: false,
  showJoiningMeetingSpinner: false,
  showSpaceSettingsModal: false,
  showLayoutModal: false,
  showModalSpaceInvite: false,
  showModalDigitalCall: false,
  showIncomingCallModal: false,

  // MEDIA
  cameraOptions: [],
  speakersOptions: [],
  micOptions: [],
  cameraAllowed: false,
  videoMuted: true,
  audioMuted: true,
  onScreenShare: false,
  micDevices: [],
  cameraDevices: [],
  speakerDevices: [],
  recording: false,
  isNoiseReductionEnabled: false,
  currentLayout: VIDEO_LAYOUT_TYPES.AUTOMATIC || '',
  currentTheme: VIDEO_BACKGROUND_THEME.COFFEE_SHOP || '',
  backgroundBlurCapability: {},
  backgroundImageCapability: {},
  currentBackground: BACKGROUND_OPTION.OFF || '',

  // USER PERMISSIONS
  attachmentFeatureDenied: true
};

export function appReducer(state = initialState, action) {
  switch (action.type) {
    case JOIN_SPACE:
    case JOIN_DIRECT_SPACE:
    case SEND_MESSAGE:
    case SEND_POST:
    case SEND_EDITED_POST:
    case TOGGLE_CAMERA:
    case TOGGLE_MICROPHONE:
    case GET_COLLEAGUES_AND_DM_LIST:
    case POP_CURRENT_SPACE:
    case PRE_JOIN_SPACE:
    case GET_SPACE_FROM_INVITE_LINK:
    case SEND_TASK:
    case SET_END_MEETING:
    case SELECT_CAMERA:
    case SELECT_MIC:
    case SELECT_SPEAKERS:
    case GET_SPACE_POSTS:
    case GET_SPACE_TASKS:
    case GET_SPACE_MEETINGS:
    case DELETE_TASK:
    case REVOKE_TOKEN:
    case REFRESH_TOKEN:
      return { ...state };
    case SHOW_MODAL_SPACE_INVITE:
      return {
        ...state,
        showModalSpaceInvite: action.val
      };
    case SHOW_AUTH_MODAL:
      return {
        ...state,
        showAuthModal: action.val
      };
    case SHOW_MODAL_POST_CREATE:
      return {
        ...state,
        showModalPostCreate: action.val
      };
    case SHOW_MODAL_POST_EDIT:
      return {
        ...state,
        showModalPostEdit: action.val,
        postCurrentlyEdited: action?.postCurrentlyEdited
      };
    case SHOW_MODAL_TASK_EDIT:
      return {
        ...state,
        showModalTaskEdit: action.val,
        taskCurrentlyEdited: action.task
      };
    case SET_ZOOM_SIZE:
      return {
        ...state,
        contentSharingRendererZoom: Math.max(
          Math.min(action.val, state.maxZoomValue),
          state.minZoomValue
        )
      };

    case SET_ME:
      return {
        ...state,
        me: action.val
      };
    case SET_SCREENSHARE:
      return {
        ...state,
        onScreenShare: action.val
      };
    case SET_PEOPLE_WITH_DM:
      return {
        ...state,
        peopleWithDM: action.val
      };
    case SET_MY_SPACES:
      return {
        ...state,
        mySpaces: action.val
      };
    case SET_SPACE_TITLE:
      return {
        ...state,
        spaceTitle: action.val
      };
    case SHOW_SUBSCRIBING_SPINNER:
      return {
        ...state,
        showSubscribingSpinner: action.val
      };
    case SHOW_JOINING_MEETING_SPINNER:
      return {
        ...state,
        showJoiningMeetingSpinner: action.val
      };
    case SET_CHANNEL_SUBSCRIBED:
      return {
        ...state,
        channelSubscribed: action.val
      };
    case SET_SPACE_MEMBERS:
      return {
        ...state,
        spaceMembers: { ...action.val }
      };
    case SET_SPACE_POSTS:
      return {
        ...state,
        spacePosts: action.val
      };
    case SET_SPACE_TASKS:
      return {
        ...state,
        spaceTasks: action.val
      };
    case SET_SPACE_MEETINGS:
      return {
        ...state,
        spaceMeetings: action.val
      };
    case SET_CONFERENCE_CALL:
      return {
        ...state,
        conferenceCall: action.val
      };
    case SHOW_DEVICE_SELECTION_MODAL:
      return {
        ...state,
        showDevicesModal: action.val
      };
    case SHOW_MODAL_LAYOUT:
      return {
        ...state,
        showLayoutModal: action.val
      };

    case SET_COLLEAGUES_AND_DM_LIST:
      console.log(`SET_COLLEAGUES_AND_DM_LIST: ${JSON.stringify(action.val)}`);

      return {
        ...state,
        colleaguesAndDMList: action.val
      };

    case SET_AUTH_METHOD:
      return {
        ...state,
        authMethodChosen: action.val
      };
    case SET_INVITATION_AUTHORIZATION:
      return {
        ...state,
        invitationAuth: action.val
      };
    case SET_CAMERA_STATE:
      return {
        ...state,
        videoMuted: action.val
      };
    case SET_MICROPHONE_STATE: {
      return {
        ...state,
        audioMuted: action.val
      };
    }
    case SET_TOKEN: {
      return {
        ...state,
        token: action.val
      };
    }
    case SET_SPACE_ID: {
      return {
        ...state,
        spaceId: action.val
      };
    }
    case SET_CLIENT_ID: {
      return {
        ...state,
        client_id: action.val
      };
    }
    case SET_CLIENT_SECRET: {
      return {
        ...state,
        client_secret: action.val
      };
    }
    case SET_USERNAME: {
      return {
        ...state,
        username: action.val
      };
    }
    case SET_PASSWORD: {
      return {
        ...state,
        password: action.val
      };
    }
    case SET_ANON_USERNAME: {
      return {
        ...state,
        anonUsername: action.val
      };
    }
    case SET_SPACE_PIN: {
      return {
        ...state,
        spacePin: action.val
      };
    }
    case SET_INVITE_LINK: {
      return {
        ...state,
        inviteLink: action.val
      };
    }
    case SET_PARTY_TYPING: {
      return {
        ...state,
        partyTyping: action.val
      };
    }
    case SET_SPACE_CONTENT: {
      return {
        ...state,
        spaceContent: action.val
      };
    }
    case SET_ENVIRONMENT: {
      return {
        ...state,
        env: action.val
      };
    }
    case SHOW_MODAL_TASK_CREATE: {
      return {
        ...state,
        showModalTaskCreate: action.val
      };
    }
    case SHOW_MODAL_INCOMING_CALL: {
      return {
        ...state,
        showIncomingCallModal: action.val
      };
    }
    case SHOW_CALL_PREVIEW: {
      return {
        ...state,
        showCallPreviewModal: action.val
      };
    }
    case SET_MEETING_DATA: {
      return {
        ...state,
        meetingData: action.val
      };
    }
    case SET_USER_SETTINGS: {
      return {
        ...state,
        userSettings: action.val
      };
    }
    case SET_CAMERA_OPTIONS: {
      return {
        ...state,
        cameraOptions: action.val
      };
    }
    case SET_MIC_OPTIONS: {
      return {
        ...state,
        micOptions: action.val
      };
    }
    case SET_SPEAKER_OPTIONS: {
      return {
        ...state,
        speakersOptions: action.val
      };
    }
    case TOGGLE_RECORDING: {
      return {
        ...state,
        recording: action.val
      };
    }
    case TOGGLE_NOISE_REDUCTION: {
      return {
        ...state,
        isNoiseReductionEnabled: action.val
      };
    }
    case SET_USER_RAISED_HAND: {
      return {
        ...state,
        userRaisedHand: action.val
      };
    }
    case SET_UPLOADED_FILE: {
      return {
        ...state,
        uploadedFile: [action.val]
      };
    }
    case SET_ATTACHMENTS_FEATURE: {
      return {
        ...state,
        attachmentFeatureDenied: action.val
      };
    }
    case SHOW_MODAL_SPACE_SETTINGS: {
      return {
        ...state,
        showSpaceSettingsModal: action.val
      };
    }
    case SET_SPACE_SETTINGS: {
      return {
        ...state,
        spaceSettings: action.val
      };
    }
    case SET_CURRENT_LAYOUT: {
      return {
        ...state,
        currentLayout: action.val
      };
    }
    case SET_CURRENT_VIDEO_RESOLUTION: {
      return {
        ...state,
        currentVideoResolution: action.val
      };
    }
    case SET_INVITEE: {
      return {
        ...state,
        invitee: action.val
      };
    }

    case SET_INVITEE_ROLE: {
      state.invitees[action.inviteeId].role = action.role;

      return { ...state };
    }
    case SET_INVITEES: {
      return {
        ...state,
        invitees: [...state.invitees, action.val]
      };
    }
    case DELETE_INVITEE: {
      const removeIndex = function (array, from, to) {
        const rest = array.slice((to || from) + 1 || array.length);

        array.length = from < 0 ? array.length + from : from;

        return array.push.apply(array, rest);
      };

      const inviteesCopy = [...state.invitees];

      removeIndex(inviteesCopy, action.val);

      return {
        ...state,
        invitees: inviteesCopy
      };
    }
    case SHOW_MODAL_DIGITAL_CALL: {
      return {
        ...state,
        showModalDigitalCall: action.val
      };
    }
    case SET_CALLEE: {
      return {
        ...state,
        callee: action.val
      };
    }
    case SET_CALLER: {
      return {
        ...state,
        caller: action.val
      };
    }
    case SHOW_ERROR_ALERT: {
      return {
        ...state,
        showErrorAlert: action.val
      };
    }
    case SHOW_MODAL_PIN: {
      return {
        ...state,
        showPinModal: action.val
      };
    }
    case SET_CURRENT_MEETING_VIDEO_BACKGROUND_THEME: {
      return {
        ...state,
        currentTheme: action.val
      };
    }
    case SET_BACKGROUND: {
      return {
        ...state,
        currentBackground: action.val
      };
    }
    default:
      return state;
  }
}
