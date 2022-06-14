import {
  SHOW_MODAL_DIGITAL_CALL,
  TOGGLE_NOISE_REDUCTION,
  SET_ZOOM_SIZE,
  SET_AUTH_METHOD,
  SHOW_AUTH_MODAL,
  SHOW_SUBSCRIBING_SPINNER,
  SEND_MESSAGE,
  SHOW_MODAL_POST_CREATE,
  SHOW_MODAL_POST_EDIT,
  SHOW_MODAL_TASK_CREATE,
  SEND_POST,
  SHOW_MODAL_TASK_EDIT,
  SHOW_DEVICE_SELECTION_MODAL,
  SELECT_CAMERA,
  SELECT_MIC,
  SELECT_SPEAKERS,
  TOGGLE_MICROPHONE,
  TOGGLE_CAMERA,
  JOIN_SPACE,
  JOIN_DIRECT_SPACE,
  POP_CURRENT_SPACE,
  PRE_JOIN_SPACE,
  SHOW_ERROR_ALERT,
  SET_ERROR_DATA,
  SET_ENVIRONMENT,
  SET_INVITATION_AUTHORIZATION,
  SET_SCREENSHARE,
  SET_TOKEN,
  SET_SPACE_ID,
  SET_CLIENT_ID,
  SET_CLIENT_SECRET,
  SET_USERNAME,
  SET_PASSWORD,
  SET_ANON_USERNAME,
  SET_SPACE_PIN,
  SET_INVITE_LINK,
  GET_SPACE_FROM_INVITE_LINK,
  SEND_TASK,
  SET_END_MEETING,
  PRESET_CALL,
  SET_SPACES_CALL,
  TOGGLE_USER_SETTINGS,
  TOGGLE_RECORDING,
  LEAVE_MEETING,
  MUTE_ALL,
  ACCEPT_RAISED_HAND,
  LOWER_RAISED_HAND,
  RAISE_HAND,
  MUTE_MEMBER,
  GET_SPACE_POSTS,
  GET_SPACE_TASKS,
  GET_SPACE_MEETINGS,
  SHOW_CALL_PREVIEW,
  GET_SPACE_CONTENT,
  SET_UPLOADED_FILE,
  DELETE_TASK,
  DELETE_POST,
  DELETE_MESSAGE,
  SHOW_MODAL_SPACE_SETTINGS,
  SET_SPACE_SETTINGS,
  SHOW_MODAL_LAYOUT,
  SET_CURRENT_LAYOUT,
  REVOKE_TOKEN,
  REFRESH_TOKEN,
  TOGGLE_SPACE_PINNED,
  SHOW_MODAL_SPACE_INVITE,
  SET_INVITEES,
  SET_INVITEE,
  DELETE_INVITEE,
  SET_INVITEE_ROLE,
  SET_CALLEE,
  SHOW_MODAL_INCOMING_CALL,
  SHOW_MODAL_PIN,
  SET_CURRENT_MEETING_VIDEO_BACKGROUND_THEME,
  BACKGROUND_OPTION,
  SET_BACKGROUND
} from './types';

export const joinSpace = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.joinSpace(val);
  dispatch({ type: JOIN_SPACE, val });
};
export const deleteInvitee = (val) => (dispatch) => {
  dispatch({ type: DELETE_INVITEE, val });
};

export const toggleModalSpaceInvite = (val) => (dispatch) => {
  dispatch({ type: SHOW_MODAL_SPACE_INVITE, val });
};

export const setInvitees = (val) => (dispatch) => {
  console.log(val);
  dispatch({ type: SET_INVITEES, val });
};

export const setInvitee = (val) => (dispatch) => {
  console.log(val);
  dispatch({ type: SET_INVITEE, val });
};

export const setInviteeRole = (inviteeId, role) => (dispatch) => {
  dispatch({ type: SET_INVITEE_ROLE, inviteeId, role });
};

export const inviteToSpace = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.inviteToSpace(val);
  dispatch({ type: JOIN_SPACE, val });
};

export const toggleSpacePinned = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.toggleSpacePinned(val);
  dispatch({ type: TOGGLE_SPACE_PINNED, val });
};

export const revokeToken = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.revokeToken(val);
  dispatch({ type: REVOKE_TOKEN, val });
};

export const refreshToken = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.refreshToken(val);
  dispatch({ type: REFRESH_TOKEN, val });
};

export const setZoom = (val) => (dispatch) => {
  dispatch({ type: SET_ZOOM_SIZE, val });
};

export const setAuthMethod = (val) => (dispatch) => {
  dispatch({ type: SET_AUTH_METHOD, val });
};

export const toggleAuthModal = (val) => (dispatch) => {
  dispatch({ type: SHOW_AUTH_MODAL, val });
};

export const toggleLayoutModal = (val) => (dispatch) => {
  dispatch({ type: SHOW_MODAL_LAYOUT, val });
};

export const toggleConnectingSpinner = (val) => (dispatch) => {
  dispatch({ type: SHOW_SUBSCRIBING_SPINNER, val });
};

export const toggleModalPostCreate = (val) => (dispatch) => {
  dispatch({ type: SHOW_MODAL_POST_CREATE, val });
};

export const toggleModalPostEdit = (val, postCurrentlyEdited) => (dispatch) => {
  dispatch({ type: SHOW_MODAL_POST_EDIT, val, postCurrentlyEdited });
};

export const toggleModalTaskEdit = (val, task) => (dispatch) => {
  dispatch({ type: SHOW_MODAL_TASK_EDIT, val, task });
};

export const toggleModalSpaceSettings = (val) => (dispatch) => {
  dispatch({ type: SHOW_MODAL_SPACE_SETTINGS, val });
};

export const setSpaceSettings = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.setSpaceSettings(val);
  dispatch({ type: SET_SPACE_SETTINGS, val });
};

export const setVideoResolution = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.setVideoResolution(val);
  dispatch({ type: SET_SPACE_SETTINGS, val });
};

export const deleteTask = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.deleteTask(val);
  dispatch({ type: DELETE_TASK, val });
};

export const deletePost = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.deletePost(val);
  dispatch({ type: DELETE_POST, val });
};

export const deleteMessage = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.deleteMessage(val);
  dispatch({ type: DELETE_MESSAGE, val });
};

export const toggleModalTaskCreate = (val) => (dispatch) => {
  dispatch({ type: SHOW_MODAL_TASK_CREATE, val });
};

export const sendTask = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.sendTask(val);
  dispatch({ type: SEND_TASK, val });
};

export const sendMessage = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.sendMessage(val);
  dispatch({ type: SEND_MESSAGE, val });
};

export const validatePost = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.validatePost(val);
  dispatch({ type: SEND_POST, val });
};

export const sendEditedPost = (val) => () => {
  window.SampleAvayaSpacesSDK.sendEditedPost(val);
};

export const sendEditedTask = (val) => () => {
  window.SampleAvayaSpacesSDK.sendEditedTask(val);
};

export const sendEditedMessage = (val) => () => {
  window.SampleAvayaSpacesSDK.sendEditedMessage(val);
};

export const toggleDevicesModal = (val) => (dispatch) => {
  dispatch({ type: SHOW_DEVICE_SELECTION_MODAL, val });
};

export const toggleCallPreviewModal = (val) => (dispatch) => {
  dispatch({ type: SHOW_CALL_PREVIEW, val });
};

export const selectCamera = () => (dispatch) => {
  window.SampleAvayaSpacesSDK.selectCamera();
  dispatch({ type: SELECT_CAMERA, val: null });
};

export const selectMic = () => (dispatch) => {
  window.SampleAvayaSpacesSDK.selectMic();
  dispatch({ type: SELECT_MIC, val: null });
};

export const selectSpeakers = () => (dispatch) => {
  window.SampleAvayaSpacesSDK.selectSpeakers();
  dispatch({ type: SELECT_SPEAKERS, val: null });
};

export const toggleMicrophone = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.toggleMedia('microphone', val);
  dispatch({ type: TOGGLE_MICROPHONE, val: null });
};

export const toggleCamera = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.toggleMedia('camera', val);
  dispatch({ type: TOGGLE_CAMERA, val: null });
};

// export const getColleaguesAndDMList = val => dispatch => {
//     return new Promise((resolve, reject) => {
//         const list = window.SampleAvayaSpacesSDK.getColleaguesAndDMList(val).then(res => {
//             console.log(res)
//             return res
//         })
//         resolve(list)
//     })
// }

export const joinDirectSpace = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.joinDirectSpace(val);
  dispatch({ type: JOIN_DIRECT_SPACE, val });
};

export const popCurrentSpace = () => (dispatch) => {
  window.SampleAvayaSpacesSDK.popCurrentSpace();
  dispatch({ type: POP_CURRENT_SPACE, val: null });
};

export const preJoinSpace = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.preJoinSpace(val);
  dispatch({ type: PRE_JOIN_SPACE, val });
};

export const toggleErrorAlert = (val) => (dispatch) => {
  dispatch({ type: SHOW_ERROR_ALERT, val });
};

export const setErrorData = (val) => (dispatch) => {
  dispatch({ type: SET_ERROR_DATA, val });
};

export const setEnvironment = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.setEnv(val);
  dispatch({ type: SET_ENVIRONMENT, val });
};

export const setInvitationAuthorization = (val) => (dispatch) => {
  dispatch({ type: SET_INVITATION_AUTHORIZATION, val });
};

// TODO:
// export const toggleScreenShareWCS = (val) => (dispatch) => {
//   window.SampleAvayaSpacesSDK.toggleScreenShareWCS(val);
//   dispatch({ type: SET_SCREENSHARE, val });
// };

// export const toggleScreenShareVideo = (val) => (dispatch) => {
//   window.SampleAvayaSpacesSDK.toggleScreenShareVideo(val);
//   dispatch({ type: SET_SCREENSHARE, val });
// };

export const toggleScreenShare = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.toggleScreenShare(val);
  dispatch({ type: SET_SCREENSHARE, val });
};

export const setToken = (val) => (dispatch) => {
  dispatch({ type: SET_TOKEN, val });
};

export const setSpaceId = (val) => (dispatch) => {
  dispatch({ type: SET_SPACE_ID, val });
};

export const setClientId = (val) => (dispatch) => {
  dispatch({ type: SET_CLIENT_ID, val });
};

export const setClientSecret = (val) => (dispatch) => {
  dispatch({ type: SET_CLIENT_SECRET, val });
};

export const setUsername = (val) => (dispatch) => {
  dispatch({ type: SET_USERNAME, val });
};

export const setPassword = (val) => (dispatch) => {
  dispatch({ type: SET_PASSWORD, val });
};

export const setAnonUsername = (val) => (dispatch) => {
  dispatch({ type: SET_ANON_USERNAME, val });
};

export const setSpacePin = (val) => (dispatch) => {
  dispatch({ type: SET_SPACE_PIN, val });
};

export const togglePinModal = (val) => (dispatch) => {
  dispatch({ type: SHOW_MODAL_PIN, val });
};

export const setInviteLink = (val) => (dispatch) => {
  dispatch({ type: SET_INVITE_LINK, val });
};

export const getSpaceInfoFromInviteLink = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.getSpaceInfoFromInviteLink(val);
  dispatch({ type: GET_SPACE_FROM_INVITE_LINK, val });
};

export const presetCall = () => (dispatch) => {
  window.SampleAvayaSpacesSDK.presetCall();
  dispatch({ type: PRESET_CALL, val: null });
};

export const endMeeting = () => (dispatch) => {
  window.SampleAvayaSpacesSDK.endMeeting();
  dispatch({ type: SET_END_MEETING, val: null });
};

export const initiateSpacesCall = () => (dispatch) => {
  window.SampleAvayaSpacesSDK.initiateSpacesCall();
  dispatch({ type: SET_SPACES_CALL, val: null });
};

export const toggleUserSettings = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.toggleUserSettings(val);
  dispatch({ type: TOGGLE_USER_SETTINGS, val: null });
};

export const toggleRecording = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.toggleRecording(val);
  dispatch({ type: TOGGLE_RECORDING, val });
};

export const leaveMeeting = () => (dispatch) => {
  window.SampleAvayaSpacesSDK.leaveMeeting();
  dispatch({ type: LEAVE_MEETING, val: null });
};

export const toggleNoiseReduction = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.toggleNoiseReduction(val);
  dispatch({ type: TOGGLE_NOISE_REDUCTION, val });
};

export const muteAll = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.muteAll({ val });
  dispatch({ type: MUTE_ALL, val });
};

export const acceptRaisedHand = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.acceptRaisedHand({ val });
  dispatch({ type: ACCEPT_RAISED_HAND, val });
};

export const lowerRaisedHand = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.lowerRaisedHand({ val });
  dispatch({ type: LOWER_RAISED_HAND, val });
};

export const raiseHand = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.raiseHand();
  dispatch({ type: RAISE_HAND, val });
};

export const muteMember = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.muteMember(val);
  dispatch({ type: MUTE_MEMBER, val });
};

export const getSpacePosts = () => (dispatch) => {
  window.SampleAvayaSpacesSDK.getSpacePosts();
  dispatch({ type: GET_SPACE_POSTS, val: null });
};

export const getSpaceTasks = () => (dispatch) => {
  window.SampleAvayaSpacesSDK.getSpaceTasks();
  dispatch({ type: GET_SPACE_TASKS, val: null });
};

export const getSpaceMeetings = () => (dispatch) => {
  window.SampleAvayaSpacesSDK.getSpaceMeetings();
  dispatch({ type: GET_SPACE_MEETINGS, val: null });
};

export const getSpaceContent = () => (dispatch) => {
  window.SampleAvayaSpacesSDK.getSpaceContent();
  dispatch({ type: GET_SPACE_CONTENT, val: null });
};

export const handleDownloadMeetingInfo = (val) => async () => {
  const downloadMeetingInfo = await window.SampleAvayaSpacesSDK.createMeetingInfoTXT(val);

  return downloadMeetingInfo;
};

export const setUploadedFile = (val) => (dispatch) => {
  dispatch({ type: SET_UPLOADED_FILE, val });
};

export const uploadChatFile = (val) => () => {
  window.SampleAvayaSpacesSDK.uploadChatFile(val);
};

export const setCurrentLayout = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.setCurrentLayout(val);
  dispatch({ type: SET_CURRENT_LAYOUT, val });
};

export const initiateDigitalCall = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.initiateDigitalCall(val).then(() => {
    dispatch({ type: SET_CALLEE, val });
    dispatch({ type: SHOW_MODAL_DIGITAL_CALL, val: true });
  });
};

export const cancelDigitalCall = () => () => {
  window.SampleAvayaSpacesSDK.cancelDigitalCall();
};

export const declineDigitalCall = (val) => (dispatch) => {
  dispatch({ type: SHOW_MODAL_INCOMING_CALL, val: false });
  window.SampleAvayaSpacesSDK.declineDigitalCall(val);
};

export const acceptDigitalCall = (val) => (dispatch) => {
  dispatch({ type: SHOW_MODAL_INCOMING_CALL, val: false });
  window.SampleAvayaSpacesSDK.acceptDigitalCall(val);
};

export const setCurrentBackgroundTheme = (val) => (dispatch) => {
  window.SampleAvayaSpacesSDK.setCurrentBackgroundTheme(val);
  dispatch({ type: SET_CURRENT_MEETING_VIDEO_BACKGROUND_THEME, val });
};

export const setBackgroundBlur = () => (dispatch) => {
  window.SampleAvayaSpacesSDK.setBackgroundBlur();
  dispatch({ type: SET_BACKGROUND, val: BACKGROUND_OPTION.BLUR });
};

export const setBackgroundImage = () => (dispatch) => {
  window.SampleAvayaSpacesSDK.setBackgroundImage();
  dispatch({ type: SET_BACKGROUND, val: BACKGROUND_OPTION.IMAGE });
};

export const stopBackground = (val) => (dispatch) => {
  if (val === BACKGROUND_OPTION.BLUR) {
    window.SampleAvayaSpacesSDK.stopBackgroundBlur();
    dispatch({ type: SET_BACKGROUND, val: BACKGROUND_OPTION.OFF });
  } else if (val === BACKGROUND_OPTION.IMAGE) {
    window.SampleAvayaSpacesSDK.stopBackgroundImage();
    dispatch({ type: SET_BACKGROUND, val: BACKGROUND_OPTION.OFF });
  }
};
