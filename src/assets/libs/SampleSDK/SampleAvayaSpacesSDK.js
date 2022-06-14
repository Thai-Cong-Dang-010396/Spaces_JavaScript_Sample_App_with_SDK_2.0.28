/*
 * Avaya Inc. Proprietary (Restricted)
 * Solely for authorized persons having a need to know
 * pursuant to company instructions.
 * Copyright 2006-2015 Avaya Inc. All Rights Reserved.
 * THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF Avaya Inc.
 * The copyright notice above does not evidence any actual or
 * intended publication of such source code.
 */

import axios from 'axios';
import * as io from 'socket.io-client';
import saveFile from 'file-saver';
import moment from 'moment';
import { reject, isEmpty } from 'lodash-es';
import { Base64, getGUID } from './utils';

export default class SampleAvayaSpacesSDK {
  constructor() {
    this.token = process.env.REACT_APP_TOKEN || '';
    this.socketURL = `wss://${localStorage.getItem('websocket') || 'spacesapis-socket.avayacloud'}.com/chat`;
    this.spaceId = '';
    this.conferenceCall = null;
    this.user = null;
    this.client = null;
    this.mpaasToken = null;
    this.micDevices = [];
    this.cameraDevices = [];

    this.speakerDevices = [];
    this.socketConnection = undefined;
    this.collaboration = undefined;
    this.collaborations = undefined;
    this.onScreenShare = false;
    this.audioMuted = true;
    this.videoMuted = true;
    this.localStream = null;
    this.recording = false;
    this.recordingId = '';
    this.meetingId = '';
    this.contentSharingRenderer = null;
    this.tokenType = 'jwt';
    this.remoteStream = null;
    this.sessionId = '';
    this.inviteId = '';
    this.EventEmitter = {
      events: {},
      dispatch(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach((callback) => callback(data));
      },
      subscribe(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
      }
    };
    this.spacePosts = [];
    this.spaceTasks = [];
    this.spaceMeetings = [];
    this.spaceMembers = {};
    this.peopleWithDM = {};
    this.spaceTitle = '';
    this.anonAuthChosen = false;
    this.isBase64 = (str) => Base64.isBase64(str);
    this.base64Decode = (str) => Base64.decode(str);

    this.previousSpace = '';
    this.mySpaces = {};
    this.colleaguesAndDMList = {};
    this.spacePinRequired = false;
    this.spacePin = '';
    this.authMethodChosen = '';
    this.cameraOptions = [];
    this.micOptions = [];
    this.speakersOptions = [];
    this.env = process.env.REACT_APP_ENVIRONMENT;
    this.userRaisedHand = '';
    this.call = null;
    this.userSettings = '';
    this.spaceContent = [];
    this.meetingData = null;
    this.showModalPostEdit = false;
    this.showModalTaskEdit = false;
    this.attachmentFeatureDenied = false;
    this.mediaConfiguration = undefined;
    this.backgroundImageCapability = {};
    this.backgroundBlurCapability = {};
    this.checkBackgroundImageCapability = () =>
      !isEmpty(this.backgroundImageCapability) && !this.backgroundImageCapability?.isAllowed;
    this.checkBackgroundBlurCapability = () =>
      !isEmpty(this.backgroundBlurCapability) && !this.backgroundBlurCapability?.isAllowed;
    this.me = undefined;
    this.sender = undefined;
    this.diallingTone = new Audio(
      'https://storage.googleapis.com/spaces2020/public/spaces/sounds/dialing_tone1.mp3'
    );
    this.ringTone = new Audio(
      'https://storage.googleapis.com/spaces2020/public/spaces/sounds/ring_tone1.mp3'
    );
    this.VIDEO_RESOLUTION = {
      VIDEO_RESOLUTION_1080P: '1080P', // 1920 x 1080  (Full HD)
      VIDEO_RESOLUTION_720P: '720P', // 1280 x 720 (HD)
      VIDEO_RESOLUTION_480P: '480P', // 848 x 480 (SD)
      VIDEO_RESOLUTION_360P: '360P', // 640 x 360
      VIDEO_RESOLUTION_240P: '240P', // 416 x 240
      VIDEO_RESOLUTION_180P: '180P', // 320 x 180
      VIDEO_RESOLUTION_NO_VIDEO: 'NONE' // audio only call
    };

    this.VIDEO_RESOLUTIONS = {
      [this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_1080P]: {
        id: 'video-quality-1080p',
        value: this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_1080P,
        labelId: 'VIDEO_QUALITY_1080P',
        labelDefaultText: '1080p'
      },
      [this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_720P]: {
        id: 'video-quality-720p',
        value: this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_720P,
        labelId: 'VIDEO_QUALITY_720P',
        labelDefaultText: '720p'
      },
      [this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_480P]: {
        id: 'video-quality-480p',
        value: this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_480P,
        labelId: 'VIDEO_QUALITY_480P',
        labelDefaultText: '480p'
      },
      [this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_360P]: {
        id: 'video-quality-360p',
        value: this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_360P,
        labelId: 'VIDEO_QUALITY_360P',
        labelDefaultText: '360p'
      },
      [this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_240P]: {
        id: 'video-quality-240p',
        value: this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_240P,
        labelId: 'VIDEO_QUALITY_240P',
        labelDefaultText: '240p'
      },
      [this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_180P]: {
        id: 'video-quality-180p',
        value: this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_180P,
        labelId: 'VIDEO_QUALITY_180P',
        labelDefaultText: '180p'
      },
      [this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_NO_VIDEO]: {
        id: 'video-quality-no-video',
        value: this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_NO_VIDEO,
        labelId: 'VIDEO_QUALITY_NO_VIDEO',
        labelDefaultText: 'Audio only'
      }
    };
  }

  inviteToSpace = (invitees) => {
    const trimmedInviteeList = [];

    invitees.map((item) => {
      const trimmedInvitee = {
        // TO-DO
        // "inviteeType": item.value.inviteeType,
        inviteeType: item.inviteeType,
        invitee: item.value._id,
        role: item.role
      };

      return trimmedInviteeList.push(trimmedInvitee);
    });
    axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId}/invite`,
      data: { invitees: trimmedInviteeList },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${this.tokenType} ${this.token}`
      }
    })
      .then((res) => {
        console.log(res);
        this.EventEmitter.dispatch('state', { data: { showModalSpaceInvite: false } });
        this.EventEmitter.dispatch('success', { message: 'Invitation sent' });
      })
      .catch((err) => {
        console.log(err);
        this.EventEmitter.dispatch('error', { message: 'Could not invite to space' });
      });
  };

  setEnv = (env) => {
    console.log('%c setEnv()', 'background: #0000ff; color: #fff');
    if (env !== undefined) this.env = env;
    if (this?.env === 'staging') {
      localStorage.setItem('spaces_app', 'loganstaging.esna');
      localStorage.setItem('accounts_app', 'onesnastaging.esna');
      localStorage.setItem('spaces_apis', 'loganstagingapis.esna');
      localStorage.setItem('websocket', 'loganstagingapis-socket.esna');
    } else if (this?.env === 'production') {
      localStorage.setItem('spaces_app', 'spaces.avayacloud');
      localStorage.setItem('accounts_app', 'accounts.avayacloud');
      localStorage.setItem('spaces_apis', 'spacesapis.avayacloud');
      localStorage.setItem('websocket', 'spacesapis-socket.avayacloud');
    }
    this.EventEmitter.dispatch('success', { message: `Environment set to: ${this.env}` });
  };

  toggleSpacePinned = ({ spaceId, isPinned }) => {
    console.log('%c toggleSpacePinned()', 'background: #0000ff; color: #fff');

    axios({
      method: 'POST',
      url: 'http://localhost:3001/preferences',
      headers: { 'Content-Type': 'application/json' },
      data: { spaceId, isPinned, token: this.token, tokenType: this.tokenType }
    })
      .then(() => {
        this.EventEmitter.dispatch('success', {
          message: `Space ${isPinned ? 'pinned' : 'unpinned'}`
        });
        this.getMySpaces();
      })
      .catch((err) => {
        console.log(err);
        this.EventEmitter.dispatch('error', { message: "Can't pin/unpin space" });
      });
  };

  getAnonSpacesToken = (anonUsername) => {
    console.log('%c getAnonSpacesToken()', 'background: #0000ff; color: #fff');

    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: `https://${localStorage.getItem('spaces_apis')}.com/api/anonymous/auth`,
        data: {
          displayname: anonUsername,
          username: anonUsername
        },
        headers: { 'Content-Type': 'application/json' }
      })
        .then((res) => {
          resolve(res.data.token);
          this.EventEmitter.dispatch('success', { message: 'Anonymous token retrieved' });
        })
        .catch((err) => {
          console.log(err);
          reject(err);
          this.EventEmitter.dispatch('error', { message: 'Could not retrieve anonymous token' });
        });
    });
  };

  getMyInfo = () => {
    console.log('%c getMyInfo() ', 'background: #0000ff; color: #fff');
    axios({
      method: 'GET',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/users/me`,
      headers: { Authorization: `${this.tokenType} ${this.token}` }
    })
      .then((res) => {
        this.me = res.data;
        this.sender = {
          _id: this.me._id,
          displayname: this.me.displayname,
          phone_numbers: this.me.phone_numbers
        };
        this.EventEmitter.dispatch('state', { data: { me: this.me } });
        this.EventEmitter.dispatch('success', { message: 'Current user data retrieved' });
        this.getPeopleWithDMList();
      })
      .catch((err) => {
        console.log(err);
        this.EventEmitter.dispatch('error', { message: 'Could not retrieve current user data' });
      });
  };

  getPeopleWithDMList = () => {
    console.log('%c getPeopleWithDMList() ', 'background: #0000ff; color: #fff');
    axios({
      method: 'GET',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/users/me/people/withdm`,
      headers: { Authorization: `${this.tokenType} ${this.token}` }
    })
      .then((res) => {
        // Converted to object to avoid repeating members
        res.data.data.map(
          (item) => (this.peopleWithDM = { ...this.peopleWithDM, [item._id]: item })
        );
        this.EventEmitter.dispatch('state', { data: { peopleWithDM: this.peopleWithDM } });
        this.EventEmitter.dispatch('success', { message: 'People with DM list retrieved' });
      })
      .catch(() =>
        this.EventEmitter.dispatch('error', { message: 'Could not retrieve people with DM list' })
      );
  };

  getSpaceMemberList = () => {
    console.log('%c getSpaceMemberList() ', 'background: #0000ff; color: #fff');
    axios({
      method: 'GET',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId}/members`,
      headers: { Authorization: `${this.tokenType} ${this.token}` }
    })
      .then((res) => {
        res.data.data.map(
          (item) => (this.spaceMembers = { ...this.spaceMembers, [item.member]: item })
        );
        this.EventEmitter.dispatch('state', { data: { spaceMembers: this.spaceMembers } });
        this.EventEmitter.dispatch('success', { message: 'Space member list retrieved' });
      })
      .catch(() =>
        this.EventEmitter.dispatch('error', { message: 'Could not retrieve space member list' })
      );
  };

  redirectToAvayaCloudIdentity = (grant_type) => {
    console.log('%c redirectToAvayaCloudIdentity() ', 'background: #0000ff; color: #fff');
    window.location = `https://${localStorage.getItem(
      'accounts_app'
    )}.com/oauth2/authorize?redirect_uri=http://localhost:3000/&response_type=code&client_id=${this.client_id
      }&&scope=email%20profile%20spaces&state=0&access_type=offline&grant_type=${grant_type}`;
  };

  revokeToken = () => {
    console.log('%c revokeToken() ', 'background: #0000ff; color: #fff');
    const form = new FormData();

    form.append('refresh_token', localStorage.getItem('refresh_token'));
    form.append('client_id', sessionStorage.getItem('client_id'));
    console.log(localStorage.getItem('refresh_token'));
    console.log(sessionStorage.getItem('client_id'));
    const config = {
      method: 'post',
      url: `https://${localStorage.getItem('accounts_app')}.com/oauth2/revoke_token`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: form
    };

    axios(config)
      .then(() => {
        this.EventEmitter.dispatch('success', { message: 'Access token revoked' });
        localStorage.clear();
        sessionStorage.clear();
        this.popCurrentSpace();
        window.location = 'http://localhost:3000';
      })
      .catch((error) => {
        console.log(error);
        this.EventEmitter.dispatch('error', { message: 'Could not revoke access token' });
      });
  };

  refreshToken = () => {
    console.log('%c refreshToken() ', 'background: #0000ff; color: #fff');
    this.getAccessToken('refresh_token')
      .then(() => {
        this.EventEmitter.dispatch('success', { message: 'Access token refreshed' });
      })
      .catch((err) => {
        console.log(err);
        this.EventEmitter.dispatch('error', { message: 'Could not refresh access token' });
      });
  };

  getAccessToken = async (grant_type) => {
    console.log('%c getAccessToken() ', 'background: #0000ff; color: #fff');

    const form = new FormData();

    form.append('grant_type', grant_type);
    form.append('client_id', sessionStorage.getItem('client_id'));
    form.append('client_secret', sessionStorage.getItem('client_secret'));
    form.append('scope', 'spaces profile email');

    switch (grant_type) {
      case 'authorization_code':
        form.append('redirect_uri', 'http://localhost:3000/');
        form.append('code', sessionStorage.getItem('code'));
        break;
      case 'password':
        form.append('username', this.username);
        form.append('password', this.password);
        break;
      case 'refresh_token':
        form.append('refresh_token', localStorage.getItem('refresh_token'));
        break;
      default:
        break;
    }

    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: 'http://localhost:3001/access_token',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: form
      })
        .then((res) => {
          console.log(res);
          localStorage.setItem('access_token', res.data.access_token);
          localStorage.setItem('refresh_token', res.data.refresh_token);
          localStorage.setItem('id_token', res.data.id_token);
          this.EventEmitter.dispatch('success', { message: 'Access token retrieved' });
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          this.EventEmitter.dispatch('error', { message: 'Could not retrieve the access token' });
          reject(err);
        });
    });
  };

  getSpaceInfoFromInviteLink = (params) => {
    console.log('%c getSpaceInfoFromInviteLink()', 'background: #0000ff; color: #fff');
    const { inviteLink, invitationAuth, anonUsername, token, spacePin } = params;
    const splitLink = new URL(inviteLink).pathname.split('/');

    this.token = token;
    this.spacePin = spacePin;

    // 1. Get invite id
    if (splitLink[1] === 'spaces' && splitLink[2] === 'invites') {
      this.inviteId = splitLink[3];
    } else {
      this.EventEmitter.dispatch('error', { message: 'Could not retrieve inviteId' });

      return;
    }
    // 2. Check the auth method
    if (invitationAuth === 'anonInvitation') {
      this.authMethodChosen = 'anonToken';
      this.getAnonSpacesToken(anonUsername).then((token) => {
        this.token = token;
        this.tokenType = 'jwt';
        axios({
          method: 'GET',
          url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/invites/${this.inviteId
            }/join`,
          headers: {
            Authorization: `${this.tokenType} ${this.token}`,
            'spaces-x-space-password': this.spacePin
          }
        })
          .then((res) => {
            this.spaceId = res.data.topic._id;
            this.EventEmitter.dispatch('state', { data: { spaceId: this.spaceId } });
            axios({
              method: 'GET',
              url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId}`,
              headers: {
                Authorization: `${this.tokenType} ${this.token}`,
                'spaces-x-space-password': this.spacePin
              }
            })
              .then((res) => {
                console.log(res);
                this.EventEmitter.dispatch('success', { message: 'Space object received' });
                if (res.data.settings?.confPin?.length) {
                  this.EventEmitter.dispatch('state', {
                    data: { spacePinRequired: true, spaceId: this.spaceId }
                  });
                  this.EventEmitter.dispatch('error', { message: 'Space PIN is required' });
                }
              })
              .catch((err) => {
                this.EventEmitter.dispatch('error', { message: 'Could not retrieve space object' });
                console.log(err);
              });
          })
          .catch((err) => {
            if (err.response.status === 403) {
              this.EventEmitter.dispatch('state', { data: { spacePinRequired: true } });
              this.EventEmitter.dispatch('error', { message: 'Forbidden. Please check your PIN' });
            } else {
              this.EventEmitter.dispatch('error', {
                message: 'Could not join, please check your access token'
              });
            }
          });
      });
    }
    if (invitationAuth === 'jwtInvitation') {
      this.authMethodChosen = 'jwtToken';
      this.tokenType = 'jwt';
      axios({
        method: 'GET',
        url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/invites/${this.inviteId
          }/join`,
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'spaces-x-space-password': this.spacePin || ''
        }
      })
        .then((res) => {
          this.spaceId = res.data.topic._id;
          this.EventEmitter.dispatch('state', { data: { spaceId: this.spaceId } });
          axios({
            method: 'GET',
            url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId}`,
            headers: {
              Authorization: `${this.tokenType} ${this.token}`,
              'spaces-x-space-password': this.spacePin
            }
          })
            .then((res) => {
              this.EventEmitter.dispatch('success', { message: 'Space object received' });
              if (res.data.settings?.confPin?.length) {
                this.EventEmitter.dispatch('error', { message: 'Space PIN is required' });
                this.EventEmitter.dispatch('state', {
                  data: { spacePinRequired: true, spaceId: this.spaceId }
                });
              }
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          if (err.response.status === 403) {
            this.EventEmitter.dispatch('state', { data: { spacePinRequired: true } });
            this.EventEmitter.dispatch('error', { message: 'Forbidden. Please check your PIN' });
          }
          this.EventEmitter.dispatch('error', {
            message: 'Could not join, please check your access token'
          });
        });
    }
  };

  preJoinSpace = (params) => {
    console.log('%c preJoinSpace()', 'background: #0000ff; color: #fff');
    // Params passed: spaceId, authMethodChosen, anonUsername, client_secret, client_id, token, username, password, spacePin
    Object.assign(this, params);
    console.log(params);

    switch (this.authMethodChosen) {
      case 'anonToken':
        this.anonAuthChosen = true;
        console.log('No authorization token found, retrieving anonymous token...');
        this.getAnonSpacesToken(this.anonUsername).then((token) => {
          this.token = token;
          this.tokenType = 'jwt';
          this.joinSpace();
        });
        break;
      case 'jwtToken':
        this.tokenType = 'jwt';
        this.joinSpace();
        break;
      case 'authorizationCode':
        sessionStorage.setItem('client_id', this.client_id);
        sessionStorage.setItem('client_secret', this.client_secret);
        sessionStorage.setItem('spaceId', this.spaceId);

        if (sessionStorage.getItem('code') !== null) {
          this.getAccessToken('authorization_code')
            .then((res) => {
              this.token = res.data.access_token;
              // TODO: check if token is dispatched?
              this.tokenType = 'bearer';
              this.joinSpace();
            })
            .catch((err) => console.log(err));
        } else this.redirectToAvayaCloudIdentity('authorization_code');
        break;

      case 'password':
        sessionStorage.setItem('client_id', this.client_id);
        sessionStorage.setItem('client_secret', this.client_secret);
        sessionStorage.setItem('spaceId', this.spaceId);
        this.getAccessToken('password').then((res) => {
          localStorage.setItem('access_token', res.data.access_token);
          localStorage.setItem('refresh_token', res.data.refresh_token);
          localStorage.setItem('id_token', res.data.id_token);
          this.token = res.data.access_token;
          this.tokenType = 'bearer';
          this.joinSpace();
        });
        break;
      case 'invitation':
        this.joinSpace();
        break;
      default:
        this.EventEmitter.dispatch('error', { message: 'Invalid authMethodChosen property' });
        break;
    }
  };

  registerForNetworkEvents = () => {
    if (this.user && this.user.getCalls) {
      const calls = this._user.getCalls();
      const capability = calls.getSetOnNetworkEventsCapability();

      if (capability && capability.isAllowed) {
        const acceptedEvents = this.buildEventsSubscription();

        calls.setOnNetworkEvents(acceptedEvents, this._onNetworkEventsCallback).then(
          (subscribedEvents) => {
            console.log(subscribedEvents);
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        console.log('SetOnNetworkEvents capability isAllowed === false');
      }
    }
  };

  _onNetworkEventsCallback = (events) => {
    if (!events || !events.length) {
      console.warn('event ignored - invalid event parameters', events);

      return;
    }
    events.forEach((event) => {
      this.processNetworkEvent(event);
    });
  };

  processNetworkEvent(event) {
    if (this.isActiveSpeakerEvent(event)) {
      this.processActiveSpeakerEvent(event);
    }
  }

  isActiveSpeakerEvent(event) {
    const res =
      event &&
      event.resourceId &&
      event.resourceType === 'CONFERENCE' &&
      event.details &&
      event.details.sessions &&
      event.details.sessions.length > 0 &&
      event.trigger === 'SUBSCRIPTION' &&
      event.name === 'ACTIVE_SPEAKER_NOTIFY';

    return res;
  }

  processActiveSpeakerEvent(event) {
    let sender;
    let mdsrvSessionId;
    const otherSpeakers = [];
    let topicId;

    event.details.sessions.forEach((speaker) => {
      if (speaker.opaqueData && this.isBase64(speaker.opaqueData)) {
        try {
          const decodedData = this.base64Decode(speaker.opaqueData);

          if (decodedData && decodedData.length > 0) {
            const opaqueData = JSON.parse(decodedData);
            // console.log("speaker information" + opaqueData)
            const attendee = opaqueData.user;

            topicId = opaqueData.topicId || topicId;
            if (!sender && attendee) {
              mdsrvSessionId = speaker.id;
              sender = attendee;
            } else if (attendee) {
              otherSpeakers.push({
                mdsrvSessionId: speaker.id,
                attendee
              });
            }
          }
        } catch (error) {
          console.log(`failed to decode or parse speaker information${error}`);
        }
      } else {
        console.log('Invalid speaker information', event);
      }
    });

    if (topicId) {
      this.emitOnActiveSpeakerChanged({
        _id: getGUID(),
        topicId,
        sender,
        content: {
          mediaSession: { mdsrvSessionId },
          otherSpeakers
        }
      });
    }
  }

  emitOnActiveSpeakerChanged(event) {
    console.log('%c Active speaker changed: ', 'background: #ff6a00; color: #fff');
    this.activeSpeaker = event.sender._id;
    this.EventEmitter.dispatch('state', { data: { activeSpeaker: this.activeSpeaker } });
  }

  startVideoForSpaces = () => {
    console.log('%c startVideoForSpaces()', 'background: #0000ff; color: #fff');
    // Ask Spaces for the MPaaS token for this room
    axios({
      method: 'GET',
      url: `https://${localStorage.getItem('spaces_app')}.com/api/mediasessions/mpaas/token/${this.spaceId
        }`,
      data: {},
      headers: { Authorization: `${this.tokenType} ${this.token}` }
    })
      .then((mpaasInfo) => {
        this.sessionId = mpaasInfo.data.sessionId;
        this.mpaasToken = mpaasInfo.data.token;
        if (this.socketConnection) {
          const mediaSessionPayload = {
            category: 'trackstatus',
            content: {
              mediaSession: {
                audio: !this.audioMuted,
                connected: true,
                screenshare: this.onScreenShare,
                selfMuted: true,
                video: !this.videoMuted
              }
            },
            topicId: this.spaceId
          };

          this.socketConnection.emit('SEND_MEDIA_SESSION_EVENTS', mediaSessionPayload);
          console.log(
            '%c socketConnection.emit SEND_MEDIA_SESSION_EVENTS ',
            'background: #0000ff; color: #fff'
          );
        }
      })
      .catch((err) => {
        this.EventEmitter.dispatch('error', { message: 'Could not retrieve mpaas token' });
        console.log(err);
      });
  };

  initiateSpacesCall = () => {
    console.log('%c initiateSpacesCall()', 'background: #0000ff; color: #fff');
    this.EventEmitter.dispatch('state', { data: { showJoiningMeetingSpinner: true } });

    // console.log("Starting conference call. Space Id is " + this.spaceId + ".");
    this.calls = this.user.getCalls();
    this.call = this.calls.createDefaultCall();
    this.mediaConfiguration = window.AvayaClientServices.Config.MediaConfiguration();
    if (this.spaceSettings?.settings?.mpaasSettings?.maxResolution === 'NONE') {
      this.call.setVideoMode(window.AvayaClientServices.Services.Call.VideoMode.INACTIVE);
    } else this.call.setVideoMode(window.AvayaClientServices.Services.Call.VideoMode.SEND_RECEIVE);
    this.call.setWebCollaboration(true); // Set to true if you want to enable web collaboration

    this.call.addOnCallIncomingVideoAddRequestDeniedCallback(() => {
      console.log('IncomingVideoAddRequestDenied');
    });
    this.call.addOnCallFailedCallback((_call, callException) => {
      console.log('call failed', callException);
    });
    this.call.addOnCallEndedCallback((_call, event) => {
      console.log('call ended');
      console.log(event);
      // this.call = null
    });
    this.call.addOnCallEstablishingCallback(() => {
      console.log('call establishing...');
      this.EventEmitter.dispatch('state', { data: { showCallPreviewModal: false } });
    });

    const acceptedEvents = {
      category: ['CONFERENCE', 'SESSION'],
      events: ['ACTIVE_SPEAKER_NOTIFY', 'RESOURCE_NETWORK_STATUS'],
      excludedEvents: []
    };

    this.calls.setOnNetworkEvents(acceptedEvents, this._onNetworkEventsCallback).then(() => {
      console.log('%c _onNetworkEventsCallback() ', 'background: #ff6a00; color: #fff');
    });

    this.call.addOnCallVideoChannelsUpdatedCallback(() => {
      console.log('Video channels updated');
      const mediaEngine = this.client.getMediaServices();
      const videoChannels = this.call.getVideoChannels();

      console.log(videoChannels);

      console.log(`Negotiated resolution: ${videoChannels[0].getNegotiatedResolution()}`);
      console.log(`Negotiated direction: ${videoChannels[0].getNegotiatedDirection()}`);
      if (videoChannels[0]) {
        const mediaDirection = videoChannels[0].getNegotiatedDirection();

        switch (mediaDirection) {
          case window.AvayaClientServices.Services.Call.MediaDirection.RECV_ONLY:
            console.log('Media is received but not sent');
            break;
          case window.AvayaClientServices.Services.Call.MediaDirection.SEND_ONLY:
            console.log('Media is sent but no media is received.');
            break;
          case window.AvayaClientServices.Services.Call.MediaDirection.SEND_RECV:
            console.log('Media is sent and received');
            this.remoteStream = mediaEngine
              .getVideoInterface()
              .getRemoteMediaStream(videoChannels[0].getChannelId());
            // if (window.AvayaClientServices.Base.Utils.isDefined(this.remoteStream)) {
            this.startRemoteVideo(this.remoteStream);
            // }
            break;
          case window.AvayaClientServices.Services.Call.MediaDirection.INACTIVE:
            this.getLocalRemoteStreams(mediaEngine, videoChannels);
            console.log(this.remoteStream.getTracks());
            console.log('No media flow. No media is transmitted or received');
            break;
          case window.AvayaClientServices.Services.Call.MediaDirection.DISABLE:
            console.log('Media direction has been disabled.');
            break;
          default:
            break;
        }
      }
    });
    this.call.addOnCallEstablishedCallback((call) => {
      console.log('call established!');

      this.conferenceCall = call;
      this.EventEmitter.dispatch('state', {
        data: { conferenceCall: this.conferenceCall, showJoiningMeetingSpinner: false }
      });

      const mediaSessionPayload = {
        category: 'trackstatus',
        content: {
          mediaSession: {
            audio: !this.audioMuted,
            connected: true,
            screenshare: this.onScreenShare,
            selfMuted: true,
            video: !this.videoMuted
          }
        },
        topicId: this.spaceId
      };

      console.log('sending MEDIA SESSION EVENT');
      this.socketConnection.emit('SEND_MEDIA_SESSION_EVENTS', mediaSessionPayload);

      const presencePayload = {
        category: 'app.event.presence.party.online',
        content: {
          desktop: false,
          idle: false,
          mediaSession: {
            audio: !this.audioMuted,
            connected: true,
            phone: false,
            screenshare: false,
            selfMuted: true,
            video: !this.videoMuted
          },
          offline: false,
          role: 'guest'
        },
        topicId: this.spaceId
      };

      this.socketConnection.emit('SEND_PRESENCE_EVENT', presencePayload);
      this.getActiveMeeting();
      try {
        this.collaborations = this.user.getCollaborations();
        this.collaboration = this.collaborations.getCollaborationForCall(this.call.getCallId());
        this.collaboration.addOnCollaborationStartedCallback(() => {
          console.log('Collaboration Started...');
        });
        this.collaboration.addOnCollaborationInitializedCallback(() => {
          console.log('Collaboration Initialized...');
        });
        this.collaboration.addOnCollaborationServiceAvailableCallback(() => {
          // DRP Group !!!!
          console.log('Collaboration Service Available...');
        });
        this.collaboration.getContentSharing().addOnContentSharingEndedCallback(() => {
          console.log('Content Sharing Ended...');
          this.toggleScreenShare(false);
          this.startLocalVideo();
          this.onScreenShare = false;
          this.EventEmitter.dispatch('state', { data: { onScreenShare: this.onScreenShare } });
        });
        this.collaboration.getContentSharing().onScreenSharingCapabilityChangedCallback((res) => {
          console.log(`Screen Sharing Capability Changed ${res}`);
        });
      } catch (err) {
        console.log(`Error: ${err.message}`);
      }
      this.startLocalVideo();

      // TO BE KEPT FOR FUTURE REFERENCE

      // this.call.addOnAnswerCallRequestedCallback((call) => {
      //     console.log('addOnAnswerCallRequestedCallback')
      // });
      // this.call.addOnAudioStreamUpdatedCallback((call) => {
      //     console.log('addOnAudioStreamUpdatedCallback')
      // });
      // this.call.addOnCallAudioMuteStatusChangedCallback((call) => {
      //     console.log('addOnCallAudioMuteStatusChangedCallback')
      // });
      // this.call.addOnCallConferenceStatusChangedCallback((call) => {
      //     console.log('addOnCallConferenceStatusChangedCallback')
      // });
      // this.call.addOnCallSpeakerMuteStatusChangedCallback((call) => {
      //     console.log('addOnCallSpeakerMuteStatusChangedCallback')
      // });
      // this.call.addOnCallStartedCallback((call) => {
      //     console.log('addOnCallStartedCallback')
      // });
      // this.call.addOnCallVideoChannelsUpdatedCallback((call) => {
      //     console.log('addOnCallVideoChannelsUpdatedCallback')
      // });
      // this.call.addOnCallVideoRemovedRemotelyCallback((call) => {
      //     console.log('addOnCallVideoRemovedRemotelyCallback')
      // });
    });
    this.call.addOnCallConferenceStatusChangedCallback(() => {
      this.collaboration.addOnCollaborationServiceAvailableCallback(() => {
        console.log('addOnCollaborationServiceAvailableCallback');
        this.collaboration.getContentSharing().addOnContentSharingStartedCallback(() => {
          // console.log("addOnContentSharingStartedCallback");
          this.contentSharingRenderer =
            new window.AvayaClientServices.Renderer.Konva.KonvaContentSharingRenderer();
          if (this.onScreenShare) {
            console.log('Sending screenshare');
            document.querySelector('#localVideoElement').srcObject = this.collaboration
              .getContentSharing()
              .getOutgoingScreenSharingStream();
            // this.EventEmitter.dispatch('state', { data: { onScreenShare: this.onScreenShare } })
          } else {
            console.log('Receiving screenshare');
            this.contentSharingRenderer.init(
              this.collaboration.getContentSharing(),
              'screenReceiveFrame'
            );
          }
        });
        this.collaboration.getContentSharing().addOnContentSharingEndedCallback(() => {
          // console.log("addOnContentSharingEndedCallback");
        });
      });
      this.collaboration.addOnCollaborationServiceUnavailableCallback(() => {
        console.log('addOnCollaborationServiceUnavailableCallback');
      });
      console.log('addOnCallConferenceStatusChangedCallback');
      this.collaboration.start().catch((e) => {
        console.log(`Error starting collaboration: ${e}`);
      });
    });
    this.videoMuted && this.call.muteVideo();
    this.audioMuted && this.call.muteAudio();
    this.EventEmitter.dispatch('state', { data: { showCallPreviewModal: false } });
    this.call.start();
  };

  getDirectSpaceId = async (userId) =>
    new Promise((resolve, reject) => {
      console.log('%c joinDirectSpace()', 'background: #0000ff; color: #fff');
      axios({
        method: 'GET',
        url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/direct/${this.anonAuthChosen ? 'anonymous' : 'user'
          }/${userId}`,
        headers: { Authorization: `${this.tokenType} ${this.token}` }
      })
        .then((res) => {
          this.spaceId = res.data.data[0]._id;

          return resolve(this.spaceId);
        })
        .catch((err) => {
          reject(err);
        });
    });

  joinDirectSpace = async (userId) =>
    new Promise((resolve) => {
      console.log('%c joinDirectSpace()', 'background: #0000ff; color: #fff');
      this.getDirectSpaceId(userId)
        .then((spaceId) => {
          console.log(spaceId);
          this.joinSpace(spaceId).then(() => resolve());
        })
        .catch((err) => console.log(err));
    });

  getMySpaces = () => {
    console.log('%c getMySpaces()', 'background: #0000ff; color: #fff');

    axios({
      method: 'GET',
      url: `https://${localStorage.getItem(
        'spaces_apis'
      )}.com/api/users/me/spaces?size=50&topictype=group`,
      headers: { Authorization: `${this.tokenType} ${this.token}` }
    }).then((res) => {
      res.data.data.map((item) => (this.mySpaces = { ...this.mySpaces, [item._id]: item }));
      console.log(this.mySpaces);
      this.EventEmitter.dispatch('state', { data: { mySpaces: this.mySpaces } });
    });
  };

  getColleaguesAndDMList = (query) =>
    new Promise((resolve) => {
      console.log('%c getColleaguesAndDMList()', 'background: #0000ff; color: #fff');

      this.colleaguesAndDMList = {};
      axios({
        method: 'GET',
        url: `https://${localStorage.getItem(
          'spaces_apis'
        )}.com/api/users/me/people/withdm?search=${query}`,
        headers: { Authorization: `${this.tokenType} ${this.token}` }
      }).then((res) => {
        this.colleaguesAndDMList = res.data.data.filter(
          (item) => (this.colleaguesAndDMList[item._id] = item)
        );
        axios({
          method: 'GET',
          url: `https://${localStorage.getItem(
            'spaces_apis'
          )}.com/api/users/me/colleagues?search=${query}`,
          headers: { Authorization: `${this.tokenType} ${this.token}` }
        }).then((res) => {
          this.colleaguesAndDMList = res.data.data.filter(
            (item) => (this.colleaguesAndDMList[item._id] = item)
          );
          if (this.colleaguesAndDMList[this.me._id]) delete this.colleaguesAndDMList[this.me._id];
          this.EventEmitter.dispatch('state', {
            data: { colleaguesAndDMList: this.colleaguesAndDMList }
          });
          console.log(this.colleaguesAndDMList);
          resolve(this.colleaguesAndDMList);
        });
      });
    });

  joinSpace = async (passedSpaceId) =>
    new Promise((resolve, reject) => {
      console.log('%c joinSpace()', 'background: #0000ff; color: #fff');

      // Create a client object
      this.client = new window.AvayaClientServices();
      this.channelSubscribed && this.popCurrentSpace();
      this.getMyInfo();
      this.getMySpaces();
      this.getUserSettings();
      this.getActiveMeeting();
      this.getSpaceSettings();

      if (passedSpaceId) this.spaceId = passedSpaceId;
      const connectionPayload = {
        query: `token=${this.token}&tokenType=${this.tokenType === 'bearer' ? 'oauth' : 'jwt'}`,
        transports: ['websocket']
      };

      axios({
        method: 'GET',
        url:
          this.inviteURL ||
          `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId}/join`,
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'spaces-x-space-password': this.spacePin
        }
      })
        .then((res) => {
          if (res.data.settings?.confPin?.length) {
            this.EventEmitter.dispatch('state', { data: { showPinModal: true } });
            this.EventEmitter.dispatch('error', { message: 'Space PIN is required' });
          }

          this.socketConnection = io.connect(this.socketURL, connectionPayload);
          this.initiateSocketListeners();
          this.spaceTitle = res.data.topic?.title || res.data.topic.type;
          this.EventEmitter.dispatch('state', {
            data: { spaceTitle: this.spaceTitle, showSubscribingSpinner: false }
          });
          this.EventEmitter.dispatch('success', {
            message: `Successfully connected to space: ${this.spaceTitle}`
          });
          // Ask Spaces for the MPaaS token for this room
          axios({
            method: 'GET',
            url: `https://${localStorage.getItem('spaces_app')}.com/api/mediasessions/mpaas/token/${this.spaceId
              }`,
            data: {},
            headers: {
              Authorization: `${this.tokenType} ${this.token}`,
              'spaces-x-space-password': this?.spacePin
            }
          })
            .then((mpaasInfo) => {
              // console.log("MpaaS Info:" + mpaasInfo);
              this.sessionId = mpaasInfo.data.sessionId;
              this.mpaasToken = mpaasInfo.data.token;

              if (this.socketConnection) {
                const mediaSessionPayload = {
                  category: 'trackstatus',
                  content: {
                    mediaSession: {
                      audio: !this.audioMuted,
                      connected: true,
                      screenshare: this.onScreenShare,
                      selfMuted: true,
                      video: !this.videoMuted
                    }
                  },
                  topicId: this.spaceId
                };

                this.socketConnection.emit('SEND_MEDIA_SESSION_EVENTS', mediaSessionPayload);
                console.log(
                  '%c socketConnection.emit SEND_MEDIA_SESSION_EVENTS ',
                  'background: #0000ff; color: #fff'
                );

                // Create configuration with the media service context passed in.
                const userConfiguration = {
                  mediaServiceContext: this.mpaasToken, // <- Set the MPaaS token here as the service context
                  callUserConfiguration: { videoEnabled: true }, // A boolean value indicating whether application allows video or not.
                  wcsConfiguration: { enabled: true }, // Boolean value indicating whether the WCS provider is enabled.
                  collaborationConfiguration: {
                    imageQuality: 10, // Default image quality used in content sharing. Web Collaboration Server may override this value. Value ranges from 1 to 10, where 10 is highest image quality.
                    contentSharingWorkerPath: '/content_sharing_worker/AvayaClientServicesWorker.min.js'
                  },
                  mediaConfiguration: {
                    virtualBackgroundConfiguration: { libraryLocation: '/selfie_segmentation/' }
                  }
                };

                // Create user object
                this.user = this.client.createUser(userConfiguration);
                // start() method will asynchronously set up connection to the MPaaS web user agent.
                // Asynchronous callback information is omitted here for simplicity.
                this.user
                  .start()
                  .then(() => {
                    this.EventEmitter.dispatch('success', { message: 'user.start success' });
                  })
                  .catch(() => {
                    reject();
                    this.EventEmitter.dispatch('error', { message: 'user.start failure' });
                  });
              }
            })
            .catch(() => {
              reject();
              this.EventEmitter.dispatch('error', { message: 'Could not retrieve MPaaS token' });
              this.EventEmitter.dispatch('state', { data: { showSubscribingSpinner: false } });
            });
          resolve();
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response.status === 403) {
            this.EventEmitter.dispatch('error', {
              message: err.response?.data?.message || 'Space PIN required'
            });
            this.EventEmitter.dispatch('state', {
              data: { showPinModal: true, showSubscribingSpinner: false }
            });
          } else {
            this.EventEmitter.dispatch('error', {
              message: 'Could not join, please check your access token'
            });
            this.EventEmitter.dispatch('state', { data: { showSubscribingSpinner: false } });
          }
        });
    });

  getUserSettings = () => {
    console.log('%c getUserSettings() ', 'background: #0000ff; color: #fff');
    axios({
      method: 'GET',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/users/me/settings`,
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        this.userSettings = res.data.data[0];
        this.attachmentFeatureDenied =
          this.userSettings.companyPolicy?.user?.denyFeatures?.attachment || false;
        this.EventEmitter.dispatch('state', {
          data: {
            userSettings: this.userSettings,
            attachmentFeatureDenied: this.attachmentFeatureDenied,
            isNoiseReductionEnabled: !this.userSettings.disableNoiseReductionOnJoin
          }
        });
        this.EventEmitter.dispatch('success', { message: 'User settings retrieved' });
      })
      .catch(() =>
        this.EventEmitter.dispatch('error', { message: 'Could not retrieve user settings' })
      );
  };

  toggleUserSettings = (params) => {
    console.log('%c toggleUserSettings() ', 'background: #0000ff; color: #fff');
    const { disablePreviewWhenJoin, muteaudio, mutevideo } = params;

    console.log(params);
    this.userSettings = { ...this.userSettings, disablePreviewWhenJoin, muteaudio, mutevideo };
    this.EventEmitter.dispatch('state', { data: { userSettings: this.userSettings } });
    axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/users/me/settings/${this.userSettings._id
        }`,
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        disablePreviewWhenJoin: !disablePreviewWhenJoin,
        muteaudio,
        mutevideo
      }
    })
      .then((res) => {
        console.log(res);
        this.getUserSettings();
        this.EventEmitter.dispatch('success', { message: 'User settings changed' });
      })
      .catch((err) => {
        console.log(err);
        this.EventEmitter.dispatch('error', { message: 'Could not change user settings' });
      });
  };

  toggleNoiseReduction = (isNoiseReductionEnabled) => {
    console.log('%c toggleNoiseReduction() ', 'background: #0000ff; color: #fff');
    this.isNoiseReductionEnabled = !isNoiseReductionEnabled;
    axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId
        }/meetings/${this.meetingId}/attendees/${this.me.aType}/${this.me._id}/operation`,
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        isNoiseReductionEnabled: !isNoiseReductionEnabled,
        mediaSessionId: this.sessionId
      }
    })
      .then(() => {
        this.isNoiseReductionEnabled = !isNoiseReductionEnabled;
        this.EventEmitter.dispatch('state', {
          data: { isNoiseReductionEnabled: this.isNoiseReductionEnabled }
        });
        this.EventEmitter.dispatch('success', {
          message: `AI Noise reduction set to: ${this.isNoiseReductionEnabled}`
        });
      })
      .catch((err) => {
        console.log(err);
        this.EventEmitter.dispatch('error', { message: 'Could not toggle AI Noise reduction' });
      });
  };

  getSpaceTasks = () => {
    axios({
      method: 'GET',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId}/tasks`,
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        this.spaceTasks = res.data.data.reverse();
        this.EventEmitter.dispatch('state', { data: { spaceTasks: this.spaceTasks } });
        this.EventEmitter.dispatch('success', { message: 'Space tasks retrieved' });
      })
      .catch(() =>
        this.EventEmitter.dispatch('error', {
          message: 'Could not retrieve tasks from a specified space'
        })
      );
  };

  getSpacePosts = () => {
    axios({
      method: 'GET',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId}/ideas`,
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        this.spacePosts = res.data.data;
        this.EventEmitter.dispatch('state', { data: { spacePosts: this.spacePosts } });
        this.EventEmitter.dispatch('success', { message: 'Space posts retrieved' });
      })
      .catch((err) => {
        console.log(err);
        this.EventEmitter.dispatch('error', {
          message: 'Could not retrieve posts from a specified space'
        });
      });
  };

  getSpaceMeetings = () => {
    axios({
      method: 'GET',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId}/meetings`,
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        this.spaceMeetings = res.data.data;
        this.EventEmitter.dispatch('state', { data: { spaceMeetings: this.spaceMeetings } });
        this.EventEmitter.dispatch('success', { message: 'Space meetings retrieved' });
      })
      .catch(() =>
        this.EventEmitter.dispatch('error', {
          message: 'Could not retrieve meetings from a specified space'
        })
      );
  };

  getSpaceContent = () => {
    console.log('%c getSpaceContent() ', 'background: #0000ff; color: #fff');
    axios({
      method: 'GET',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/topics/${this.spaceId
        }/messages/byref?=30`,
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        this.spaceContent = res.data.data.reverse();
        this.EventEmitter.dispatch('state', { data: { spaceContent: this.spaceContent } });
        this.EventEmitter.dispatch('success', { message: 'Space content retrieved' });
      })
      .catch((err) => {
        console.log(err);
        this.EventEmitter.dispatch('error', { message: 'Could not retrieve space content' });
      });
  };

  initiateSocketListeners = () => {
    console.log('%c initiateSocketListeners()', 'background: #0000ff; color: #fff');
    this.socketConnection.on('PRESENCE_EVENT_RESPONSE', (res) => {
      const currentSpaceContent = res.topicId === this.spaceId;

      if (currentSpaceContent) {
        if (res.category === 'app.event.presence.party.online') {
          console.log(`PRESENCE_EVENT_RESPONSE: ${res.category}`);
          // Push the user into members list
          if (Object.keys(this.spaceMembers).includes(res.sender._id) === false)
            this.spaceMembers = { ...this.spaceMembers, [res.sender._id]: res.sender };
          this.spaceMembers[res.sender._id] = {
            ...this.spaceMembers[res.sender._id],
            content: { ...res.content }
          };
          this.EventEmitter.dispatch('state', { data: { spaceMembers: this.spaceMembers } });
          this.EventEmitter.dispatch('success', { message: `${res.sender.displayname} is online` });
        }

        if (res.category === 'party.typing') {
          this.EventEmitter.dispatch('state', { data: { partyTyping: true } });
          setTimeout(() => {
            this.EventEmitter.dispatch('state', { data: { partyTyping: false } });
          }, 2000);
        }

        if (res.category === 'app.event.presence.party.leaves') {
          if (this.spaceMembers[res.sender._id]) {
            delete this.spaceMembers[res.sender._id];
            this.EventEmitter.dispatch('state', { data: { spaceMembers: this.spaceMembers } });
            this.EventEmitter.dispatch('success', {
              message: `${res.sender.displayname} has left`
            });
          }
        }
      }
    });
    this.socketConnection.on('connect', () => {
      // console.log("Socket connection success!");
      this.EventEmitter.dispatch('success', { message: 'Socket connection success' });

      const spaceToSubscribe = {
        channel: {
          _id: this.spaceId,
          type: 'topic'
        }
      };

      this.socketConnection.emit('SUBSCRIBE_CHANNEL', spaceToSubscribe);
    });

    this.socketConnection.on('CHANNEL_SUBSCRIBED', () => {
      // this.sendMessage("Spaces sample app is online"); // Send chat message to Space
      this.EventEmitter.dispatch('state', { data: { channelSubscribed: true } });
      this.EventEmitter.dispatch('success', { message: 'Channel subscribed' });
      const presencePayload = {
        category: 'app.event.presence.party.online',
        content: {
          desktop: false,
          idle: false,
          mediaSession: {
            audio: !this.audioMuted,
            video: !this.videoMuted,
            connected: false,
            phone: false,
            screenshare: false,
            selfMuted: true,
            offline: false,
            role: 'guest'
          },
          topicId: this.spaceId,
          loopbackMetadata: 'some metadata'
        }
      };

      this.socketConnection.emit('SEND_PRESENCE_EVENT', presencePayload);
      this.getSpaceMemberList();
      this.getSpaceContent();
    });

    this.socketConnection.on('connect_error', (err) => {
      console.log('Socket connection error:');
      console.log(err);
    });

    this.socketConnection.on('error', (err) => {
      console.log('Socket error:');
      console.log(err);
    });

    this.socketConnection.on('disconnect', () => {
      console.log('Socket disconnected.');
    });

    this.socketConnection.on('MEDIA_SESSION_RESPONSE', (res) => {
      const currentSpaceContent = res.topicId === this.spaceId;

      if (res.category === 'space.call.offer') {
        this.ringTone.play();
        this.EventEmitter.dispatch('state', { data: { caller: res, showIncomingCallModal: true } });
      }

      // console.log(res.category, 'background: #0000ff; color: #fff')
      console.log(`'%c ${res.category} ', 'background: #222; color: #bada55'`);

      if (currentSpaceContent) {
        switch (res.category) {
          case 'app.event.recording.started':
            this.recordingId = res.content.recordings[0]._id;
            this.EventEmitter.dispatch('success', { message: 'Recording started' });
            break;

          case 'app.event.recording.stopped':
            this.EventEmitter.dispatch('success', { message: 'Recording stopped' });
            break;

          case 'tracksstatus':
            if (
              this.spaceMembers[res.sender._id] !== undefined &&
              this.spaceMembers[res.sender._id].content !== undefined
            ) {
              this.spaceMembers[res.sender._id].content.mediaSession = res.content.mediaSession;
              this.EventEmitter.dispatch('state', { data: { spaceMembers: this.spaceMembers } });
            }
            break;

          case 'app.event.all.parties.muted':
            res.content.exclude.forEach((item) => {
              if (item.attendeeId === this.me._id) {
              } else {
                const mediaSessionPayload = {
                  topicId: this.spaceId,
                  category: 'tracksstatus',
                  sycnhedWithServer: true,
                  content: {
                    mediaSession: {
                      audio: false,
                      video: !this.videoMuted,
                      connected: true,
                      isCollabOnly: false,
                      mdsrvSessionId: this.sessionId,
                      joinTime: new Date()
                    },
                    streamId: this.remoteStream.id,
                    subscribeTime: new Date()
                  },
                  sender: this.sender,
                  data: [],
                  created: '2020-12-28T11:58:55.897Z',
                  version: '1.1'
                };

                this.socketConnection.emit('SEND_MEDIA_SESSION_EVENTS', mediaSessionPayload);
                this.EventEmitter.dispatch('success', { message: 'All parties were muted' });
              }
            });
            break;

          case 'app.event.meeting.permission.requested':
            this.EventEmitter.dispatch('success', { message: 'Raised hand' });
            this.userRaisedHand = res.content.targetId;
            this.EventEmitter.dispatch('state', { data: { userRaisedHand: this.userRaisedHand } });
            break;

          case 'app.event.meeting.started':
          case 'app.event.attendee.added':
          case 'app.event.attendee.left':
            this.getActiveMeeting();
            break;

          case 'app.event.meeting.ended':
            if (this.meetingData !== null) {
              this.meetingData = null;
              this.EventEmitter.dispatch('state', { data: { meetingData: this.meetingData } });
              this.leaveMeeting();
            }
            this.meetingData = res.content;
            this.EventEmitter.dispatch('state', { data: { meetingData: this.meetingData } });
            this.EventEmitter.dispatch('success', { message: 'Meeting ended' });
            break;

          // DIGITAL CALLING EVENT LISTENERS
          case 'space.call.offer.sent':
            switch (res.category) {
              case 'space.call.rejected':
              case 'space.call.not.answered':
              case 'space.call.failed': {
                const cancelSpaceCallObj = {
                  topicId: this.spaceId,
                  category: 'space.call.cancelled',
                  sender: this.sender,
                  data: [],
                  version: '1.1',
                  content: {
                    subscribeTime: this.spaceContent?.subscribedTime || new Date().toISOString(),
                    mediaSession: {}
                  },
                  created: new Date().toISOString(),
                  receivers: [this.callee],
                  topicTitle: this.callee?.displayname
                };

                console.log(res.category);
                this.diallingTone.pause();
                this.EventEmitter.dispatch('state', { data: { showModalDigitalCall: false } });
                this.socketConnection.emit('SEND_MEDIA_SESSION_EVENTS', cancelSpaceCallObj);
                break;
              }

              case 'space.call.offer.accepted':
                this.EventEmitter.dispatch('success', { message: 'space.call.accepted' });

                this.diallingTone.pause();
                this.EventEmitter.dispatch('state', { data: { showModalDigitalCall: false } });
                this.initiateSpacesCall();
                break;

              case 'space.call.no.capability':
              case 'space.call.offer.failed': {
                this.diallingTone.pause();
                this.EventEmitter.dispatch('state', { data: { showModalDigitalCall: false } });
                // Downgrade to a regular meeting

                const endSpaceCallObj = {
                  topicId: this.spaceId,
                  category: 'space.call.ended',
                  sender: this.sender,
                  data: [],
                  version: '1.1',
                  content: {
                    subscribeTime: this.spaceContent?.subscribedTime || new Date().toISOString(),
                    mediaSession: {}
                  },
                  created: new Date().toISOString(),
                  receivers: [this.callee],
                  topicTitle: this.callee?.displayname
                };

                const endVideoObj = {
                  topicId: this.spaceId,
                  category: 'video.end',
                  sender: this.sender,
                  data: [],
                  version: '1.1',
                  content: {
                    subscribeTime: this.spaceContent?.subscribedTime || new Date().toISOString(),
                    mediaSession: {}
                  },
                  created: new Date().toISOString(),
                  receivers: [this.callee],
                  topicTitle: this.callee?.displayname
                };

                this.socketConnection.emit('SEND_MEDIA_SESSION_EVENTS', endSpaceCallObj);
                this.socketConnection.emit('SEND_MEDIA_SESSION_EVENTS', endVideoObj);
                this.presetCall();
                break;
              }

              default:
                break;
            }
            break;
          default:
            break;
        }
      }
    });

    this.socketConnection.on('MESSAGE_SENT', (res) => {
      const currentSpaceContent = res.topicId === this.spaceId;
      const lastMessage = this.spaceContent[this.spaceContent.length - 1];

      // Prevent pushing message duplicate and leaks from other spaces
      if (lastMessage?.created !== res.created && currentSpaceContent) {
        this.spaceContent = [...this.spaceContent, res];
      }
      this.EventEmitter.dispatch('state', { data: { spaceContent: this.spaceContent } });
    });

    this.socketConnection.on('SEND_MESSAGE_FAILED', (error) => {
      this.EventEmitter.dispatch('error', { message: 'Failed to send a message' });
      console.log(error);
    });
  };

  extractMentions = (text = '') => {
    const MENTION_REGEXP =
      /<mention[^>]*id="([^"]+)"[^>]*type="([^"]+)"[^>]*value="([^"]+)"[^>]*>/g;
    const extractedText = text.replace(/<pre.*?>(.|\n)*?<\/pre>/g, '');
    const mentions = [];
    const mentionMatches = [...(extractedText || '').matchAll(MENTION_REGEXP)];

    mentionMatches.forEach((mentionMatch = []) => {
      mentions.push({
        id: mentionMatch[1],
        type: mentionMatch[2],
        title: mentionMatch[3]
      });
    });

    return mentions;
  };

  sendMessage = (props) => {
    console.log('%c sendMessage() ', 'background: #0000ff; color: #fff');
    console.log(props);
    const userMentions = this.extractMentions(props.message);
    const message = {
      content: { bodyText: props.message },
      category: 'chat',
      topicId: this.spaceId,
      mentions: userMentions
    };

    console.log(message);
    this.socketConnection.emit('SEND_MESSAGE', message);
  };

  uploadFile = (selectedFile) =>
    new Promise((resolve, reject) => {
      console.log('%c uploadFile() ', 'background: #0000ff; color: #fff');
      const form = new FormData();

      form.append('selectedFile', selectedFile);
      form.append('tokenType', this.tokenType);
      form.append('token', this.token);

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      axios
        .post('http://localhost:3001/upload_file', form, config)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          this.EventEmitter.dispatch('error', { message: 'Could not upload to Google storage' });
          reject(err);
        });
    });

  uploadChatFile = (selectedFile) => {
    console.log('%c uploadChatFile() ', 'background: #0000ff; color: #fff');

    return new Promise((resolve, reject) => {
      this.uploadFile(selectedFile[0])
        .then((res) => {
          console.log(res);
          this.message = {
            category: 'chat',
            chatMessages: {},
            assignees: [],
            bodyText: '',
            description: '',
            dueDate: '',
            mentions: [],
            content: {
              data: [
                {
                  fileId: res.data,
                  fileSize: selectedFile[0].size,
                  fileType: selectedFile[0].type,
                  icon: '',
                  name: selectedFile[0].name,
                  provider: 'native',
                  providerFileType: selectedFile[0].type
                }
              ]
            },
            topicId: this.spaceId
          };
          console.log(this.message);
          this.socketConnection.emit('SEND_MESSAGE', this.message);
          this.EventEmitter.dispatch('success', { message: 'File successfully uploaded' });
        })
        .then((res) => {
          this.EventEmitter.dispatch('state', { data: { uploadedFile: [] } });
          this.getSpaceContent();
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  };

  validatePost = (params) => {
    console.log('%c validatePost() ', 'background: #0000ff; color: #fff');
    const { postName, postDescription, selectedFile } = params;

    if (postName.length === 0 || postDescription.length === 0) {
      this.EventEmitter.dispatch('error', { message: 'Please fill post name and/or description' });

      return;
    }

    this.post = {
      chatMessages: {},
      category: 'idea',
      content: {
        assignees: [],
        bodyText: postName,
        description: postDescription,
        status: 'pending'
      },
      topicId: this.spaceId,
      version: '1.1'
    };

    if (typeof selectedFile !== 'undefined') {
      this.uploadFile(selectedFile).then((res) => {
        this.post = {
          ...this.post,
          content: {
            ...this.post.content,
            data: [
              {
                fileId: res.data,
                fileSize: selectedFile.size,
                fileType: selectedFile.type,
                icon: '',
                name: selectedFile.name,
                provider: 'native',
                providerFileType: selectedFile.type
              }
            ]
          }
        };

        this.socketConnection.emit('SEND_MESSAGE', this.post);
        this.EventEmitter.dispatch('state', { message: '', data: { showModalPostCreate: false } });
        this.getSpacePosts();
      });

      return;
    }
    console.log(this.post);
    this.socketConnection.emit('SEND_MESSAGE', this.post);
    this.EventEmitter.dispatch('state', { data: { showModalPostCreate: false } });
    this.getSpacePosts();
  };

  sendEditedPost = (params) => {
    console.log('%c sendEditedPost() ', 'background: #0000ff; color: #fff');
    const { editedPost } = params;

    console.log(params);

    return axios({
      method: 'POST',
      url: 'http://localhost:3001/edit_post',
      data: {
        editedPost,
        token: this.token,
        tokenType: this.tokenType
      }
    })
      .then((res) => {
        console.log(res);
        this.showModalPostEdit = false;
        this.EventEmitter.dispatch('state', {
          data: { showModalPostEdit: this.showModalPostEdit }
        });
        this.getSpacePosts();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  sendEditedTask = (params) => {
    console.log('%c sendEditedTask() ', 'background: #0000ff; color: #fff');
    const { editedTask } = params;

    console.log(params);

    return axios({
      method: 'POST',
      url: 'http://localhost:3001/edit_task',
      data: {
        editedTask,
        token: this.token,
        tokenType: this.tokenType
      }
    })
      .then((res) => {
        console.log(res);
        this.showModalTaskEdit = false;
        this.EventEmitter.dispatch('state', {
          data: { showModalTaskEdit: this.showModalTaskEdit }
        });
        this.getSpaceTasks();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  sendEditedMessage = (params) => {
    console.log('%c sendEditedMessage() ', 'background: #0000ff; color: #fff');
    const { previousMessage, editedMessage } = params;

    console.log(params);

    return axios({
      method: 'POST',
      url: 'http://localhost:3001/edit_message',
      data: {
        previousMessage,
        editedMessage,
        token: this.token,
        tokenType: this.tokenType
      }
    })
      .then((res) => {
        console.log(res);
        this.getSpaceContent();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  sendTask = (params) => {
    const { taskName, taskDescription, dueDate, selectedFile } = params;

    console.log('%c sendTask() ', 'background: #0000ff; color: #fff');
    this.task = {
      category: 'task',
      chatMessages: {},
      content: {
        assignees: [],
        bodyText: taskName,
        description: taskDescription,
        dueDate,
        status: 'pending'
      },
      topicId: this.spaceId,
      version: '1.1'
    };

    if (typeof selectedFile !== 'undefined') {
      this.uploadFile(selectedFile).then((res) => {
        this.task = {
          ...this.task,
          content: {
            ...this.task.content,
            data: [
              {
                fileId: res.data,
                fileSize: selectedFile.size,
                fileType: 'document', // TO-DO: make it dynamic
                icon: '',
                name: selectedFile.name,
                provider: 'native',
                providerFileType: selectedFile.type
              }
            ]
          }
        };

        this.socketConnection.emit('SEND_MESSAGE', this.task);
        this.EventEmitter.dispatch('state', { data: { showModalTaskCreate: false } });
        this.getSpaceTasks();
      });

      return;
    }
    this.socketConnection.emit('SEND_MESSAGE', this.task);
    this.EventEmitter.dispatch('state', { data: { showModalTaskCreate: false } });
    this.getSpaceTasks();
  };

  deleteTask = (params) => {
    console.log('%c deleteTask() ', 'background: #0000ff; color: #fff');
    const { _id } = params;

    axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/messages/deletemessages`,
      headers: { Authorization: `${this.tokenType} ${this.token}` },
      data: [_id]
    }).then((res) => {
      console.log(res);
      this.EventEmitter.dispatch('success', { message: 'Task successfully deleted' });
      this.getSpaceTasks();
    });
  };

  deletePost = (params) => {
    console.log('%c deletePost() ', 'background: #0000ff; color: #fff');
    const { _id } = params;

    axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/messages/deletemessages`,
      headers: { Authorization: `${this.tokenType} ${this.token}` },
      data: [_id]
    }).then((res) => {
      console.log(res);
      this.EventEmitter.dispatch('success', { message: 'Post successfully deleted' });
      this.getSpacePosts();
    });
  };

  deleteMessage = (params) => {
    console.log('%c deleteMessage() ', 'background: #0000ff; color: #fff');
    const { _id } = params;

    axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/messages/deletemessages`,
      headers: { Authorization: `${this.tokenType} ${this.token}` },
      data: [_id]
    }).then((res) => {
      console.log(res);
      this.EventEmitter.dispatch('success', { message: 'Message successfully deleted' });
      this.getSpaceContent();
    });
  };

  popCurrentSpace = () => {
    console.log('%c popCurrentSpace() ', 'background: #0000ff; color: #fff');
    if (this.socketConnection !== undefined) {
      const payload = {
        channel: {
          type: 'topic',
          _id: this.spaceId
        }
      };

      this.socketConnection.emit('UNSUBSCRIBE_CHANNEL', payload);
      console.log(
        '%c socketConnection.emit UNSUBSCRIBE_CHANNEL ',
        'background: #0000ff; color: #fff'
      );

      const presencePayload = {
        category: 'app.event.presence.party.leaves',
        content: {
          desktop: false,
          idle: false,
          mediaSession: {
            audio: false,
            connected: false,
            phone: false,
            screenshare: false,
            selfMuted: true,
            video: false
          },
          offline: false,
          role: 'guest'
        },
        topicId: this.spaceId,
        loopbackMetadata: 'some metadata'
      };

      this.socketConnection.emit('SEND_PRESENCE_EVENT', presencePayload);
      console.log(
        '%c socketConnection.emit SEND_PRESENCE_EVENT ',
        'background: #0000ff; color: #fff'
      );

      this.spaceMembers = {};
      this.spacePosts = [];
      this.spaceTasks = [];
      this.spaceMeetings = [];
      this.spaceContent = [];
      this.spaceTitle = '';
      this.mySpaces = [];
      this.spacePin = '';
      this.channelSubscribed = false;
      this.EventEmitter.dispatch('state', {
        data: {
          spaceMembers: this.spaceMembers,
          spacePosts: this.spacePosts,
          spaceTasks: this.spaceTasks,
          spaceMeetings: this.spaceMeetings,
          spaceTitle: this.spaceTitle,
          spaceContent: this.spaceContent,
          channelSubscribed: this.channelSubscribed,
          mySpaces: this.mySpaces,
          spacePin: this.spacePin
        }
      });

      this.leaveMeeting();
    }
  };

  leaveMeeting = () => {
    if (this.conferenceCall) {
      this.conferenceCall.end();
      this.conferenceCall = null;
      this.onScreenShare = false;
      this.EventEmitter.dispatch('state', {
        data: { conferenceCall: this.conferenceCall, onScreenShare: this.onScreenShare }
      });
      this.stopLocalVideo();
      this.stopRemoteVideo();
      this.onScreenShare && this.toggleScreenShare(false);
      this.EventEmitter.dispatch('success', { message: "You've left the meeting" });
    }
  };

  endMeeting = () => {
    console.log('%c endMeeting() ', 'background: #0000ff; color: #fff');
    axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId
        }/meetings/${this.meetingId}/end`,
      headers: { Authorization: `${this.tokenType} ${this.token}` },
      data: {
        spaceId: this.spaceId,
        meetingId: this.meetingId
      }
    })
      .then((res) => {
        console.log(res);
      })
      .catch(() => this.EventEmitter.dispatch('error', { message: 'Could not end the meeting' }));
    this.leaveMeeting();
    this.meetingData = null;
    this.EventEmitter.dispatch('state', { data: { meetingData: this.meetingData } });
    this.EventEmitter.dispatch('success', { message: 'Meeting ended' });
    this.getSpaceContent();
  };

  toggleMedia = (mediaTarget, state) => {
    console.log('%c toggleMedia() ', 'background: #0000ff; color: #fff');
    const toggleMicrophone = mediaTarget === 'microphone';
    const toggleCamera = mediaTarget === 'camera';

    if (this.call === null) {
      if (toggleCamera) {
        this.videoMuted = !state;
        this.EventEmitter.dispatch('state', { data: { videoMuted: this.videoMuted } });
        this.EventEmitter.dispatch('success', { message: `videoMuted set to ${this.videoMuted}` });
      }
      if (toggleMicrophone) {
        this.audioMuted = !state;
        this.EventEmitter.dispatch('state', { data: { audioMuted: this.audioMuted } });
        this.EventEmitter.dispatch('success', { message: `audioMuted set to ${this.audioMuted}` });
      }

      return;
    }

    if (this.call !== null) {
      if (toggleCamera) {
        if (!state) {
          this.call.muteVideo();
        } else this.call.unmuteVideo();
        this.videoMuted = !state;
        this.EventEmitter.dispatch('state', { data: { videoMuted: this.videoMuted } });
        this.EventEmitter.dispatch('success', { message: `videoMuted set to ${this.videoMuted}` });
      }
      if (toggleMicrophone) {
        if (!state) {
          this.call.muteAudio();
        } else this.call.unmuteAudio();
        this.audioMuted = !state;
        this.EventEmitter.dispatch('state', { data: { audioMuted: this.audioMuted } });
        this.EventEmitter.dispatch('success', { message: `audioMuted set to ${this.audioMuted}` });
      }

      const mediaSessionPayload = {
        topicId: this.spaceId,
        category: 'tracksstatus',
        sycnhedWithServer: true,
        content: {
          mediaSession: {
            audio: !this.audioMuted,
            video: !this.videoMuted,
            connected: true,
            isCollabOnly: false,
            mdsrvSessionId: this.sessionId
          },
          streamId: this.remoteStream.id
        },
        sender: this.sender,
        data: [],
        version: '1.1'
      };

      this.socketConnection.emit('SEND_MEDIA_SESSION_EVENTS', mediaSessionPayload);

      axios({
        method: 'POST',
        url: 'http://localhost:3001/media_toggle',
        data: {
          videoMuted: this.videoMuted,
          audioMuted: this.audioMuted,
          mdsrvSessionId: this.sessionId,
          spaceId: this.spaceId,
          attendeeType: this.me.aType,
          userId: this.me._id,
          meetingId: this.meetingId,
          tokenType: this.tokenType,
          token: this.token
        }
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          this.EventEmitter.dispatch('error', { message: 'Could not toggle media state' });
        });
    }
  };

  muteAll = () => {
    console.log('%c muteAll() ', 'background: #0000ff; color: #fff');
    axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId
        }/meetings/${this.meetingId}/muteall`,
      headers: { Authorization: `${this.tokenType} ${this.token}` },
      data: { exclusionList: [] }
    })
      .then((res) => {
        console.log(res);
        this.EventEmitter.dispatch('success', { message: 'Mute all success' });
      })
      .catch(() => this.EventEmitter.dispatch('error', { message: 'Could not initiate mute all' }));
  };

  raiseHand = () => {
    console.log('%c raiseHand() ', 'background: #0000ff; color: #fff');
    axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId
        }/meetings/${this.meetingId}/attendees/raisedhands`,
      headers: { Authorization: `${this.tokenType} ${this.token}` },
      data: { requestedPermissions: ['PERMISSION_UNMUTE'] }
    })
      .then((res) => {
        console.log(res);
        this.EventEmitter.dispatch('success', { message: 'Raise hand success' });
      })
      .catch(() => this.EventEmitter.dispatch('error', { message: 'Could not raise hand' }));
  };

  acceptRaisedHand = (params) => {
    const { attendeeId, attendeeType } = params.val;

    console.log('%c acceptRaisedHand() ', 'background: #0000ff; color: #fff');
    axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId
        }/meetings/${this.meetingId}/attendees/raisedhands/accept`,
      headers: { Authorization: `${this.tokenType} ${this.token}` },
      data: { grantedPermissions: ['PERMISSION_UNMUTE'], attendeeId, attendeeType }
    })
      .then(() => {
        this.EventEmitter.dispatch('state', { data: { userRaisedHand: '' } });
        this.EventEmitter.dispatch('success', { message: 'Raised hand accepted' });
      })
      .catch(() =>
        this.EventEmitter.dispatch('error', { message: 'Could not accept raised hand' })
      );
  };

  lowerRaisedHand = (params) => {
    const { attendeeId, attendeeType } = params;

    console.log('%c lowerRaisedHand() ', 'background: #0000ff; color: #fff');
    axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId
        }/meetings/${this.meetingId}/attendees/raisedhands/lower`,
      headers: { Authorization: `${this.tokenType} ${this.token}` },
      data: { rejectedPermissions: ['PERMISSION_UNMUTE'], attendeeId, attendeeType }
    })
      .then(() => {
        this.EventEmitter.dispatch('state', { data: { userRaisedHand: '' } });
        this.EventEmitter.dispatch('success', { message: 'Raised hand lowered' });
      })
      .catch(() => this.EventEmitter.dispatch('error', { message: 'Could not lower raised hand' }));
  };

  muteMember = (params) => {
    const { attendeeId, attendeeType } = params;

    console.log('%c muteMember() ', 'background: #0000ff; color: #fff');
    axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId
        }/meetings/${this.meetingId}/attendees/${attendeeType}/${attendeeId}/mediastate`,
      headers: { Authorization: `${this.tokenType} ${this.token}` },
      data: { audio: false }
    })
      .then(() => {
        this.EventEmitter.dispatch('state', { message: 'Member muted' });
      })
      .catch(() =>
        this.EventEmitter.dispatch('error', { message: 'Could not mute another participant' })
      );
  };

  presetCall = () => {
    console.log('%c presetCall() ', 'background: #0000ff; color: #fff');
    if (this.userSettings.disablePreviewWhenJoin) {
      return this.initiateSpacesCall();
    }
    Promise.allSettled([
      this.getSpeakerDevices(),
      this.getMicDevices(),
      this.getCameraDevices()
    ]).then((res) => {
      console.log(res);
      const awaitPreviewModal = new Promise((resolve) => {
        resolve(this.EventEmitter.dispatch('state', { data: { showCallPreviewModal: true } }));
      });

      awaitPreviewModal
        .then(() => {
          const video = document.querySelector('#previewVideoElement');

          if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
              .getUserMedia({ video: true })
              .then((stream) => {
                video.srcObject = stream;
              })
              .catch((err) => {
                console.log(`Something went wrong!${err}`);
                console.log(video);
                // CHECK: Although the user granted permission to use the matching devices, a hardware error occurred at the operating system, browser, or Web page level. It's likely your camera is already being used
                this.EventEmitter.dispatch('error', { message: 'Could not start local video' });
              });
          }
        })
        .catch((err) => {
          console.log(`Something went wrong!${err}`);
          this.EventEmitter.dispatch('error', { message: 'Could not start preview video' });
        });
    });
  };

  startRemoteVideo = (stream) => {
    console.log('%c startRemoteVideo() ', 'background: #0000ff; color: #fff');
    const video = document.querySelector('#remoteVideoElement');

    video.srcObject = stream;
    console.log(stream);
    this.EventEmitter.dispatch('success', { message: 'Remote video started' });
  };

  stopRemoteVideo = () => {
    console.log('%c stopRemoteVideo() ', 'background: #0000ff; color: #fff');
    const video = document.querySelector('#remoteVideoElement');

    video.srcObject = null;

    const presencePayload = {
      topicId: this.spaceId,
      category: 'video.end',
      sender: this.sender
    };

    this.socketConnection.emit('SEND_MEDIA_SESSION_EVENTS ', presencePayload);
    this.EventEmitter.dispatch('success', { message: 'Remote video stopped' });
  };

  startLocalVideo = () => {
    console.log('%c startLocalVideo() ', 'background: #0000ff; color: #fff');
    const video = document.querySelector('#localVideoElement');

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
        })
        .catch((err) => {
          console.log(`Something went wrong!${err}`);
          this.EventEmitter.dispatch('error', {
            message: `Could not start local video ${err}`,
            data: "Although the user granted permission to use the matching devices, a hardware error occurred at the operating system, browser, or Web page level. It's likely your camera is already being used"
          });
        });
      this.EventEmitter.dispatch('success', { message: 'Local video started' });
    }
  };

  stopLocalVideo = () => {
    console.log('%c stopLocalVideo()', 'background: #0000ff; color: #fff');
    const video = document.querySelector('#localVideoElement');

    const stream = video.srcObject;
    const tracks = stream.getTracks();

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];

      track.stop();
    }

    video.srcObject = null;
    this.EventEmitter.dispatch('success', { message: 'Local video stopped' });
  };

  // toggleScreenShare = (state) => {
  //   console.log('%c toggleScreenShare()', 'background: #0000ff; color: #fff');
  //   if (state) {
  //     console.log('Starting Screenshare');
  //     this.updateScreenshareSocketPresence(state);
  //     console.log(this.collaboration.getContentSharing())
  //     this.collaboration
  //       .getContentSharing()
  //       .startScreenSharing()
  //       .catch((err) => {
  //         console.log(`Screensharing was interrupted: ${err}`);
  //         this.onScreenShare = false;
  //         this.EventEmitter.dispatch('state', { data: { onScreenShare: this.onScreenShare } });
  //       });
  //   } else {
  //     this.updateScreenshareSocketPresence(state);
  //     this.collaboration.getContentSharing().end();
  //     this.startLocalVideo2(this.localStream);
  //   }
  // };



toggleScreenShare(state) {
          this.startingScreenShare = false;
          if (!this.collaboration) {
              this.EventEmitter.dispatch('error', { message: 'Could not start sharing local content video. Collaboration set to false' })
              return;
          }
          this.contentSharing = this.collaboration.getContentSharing();
          console.log(this.collaboration.getContentSharing().getStartScreenSharingCapability())
  
          if (!this.contentSharing) {
              this.EventEmitter.dispatch('error', { message: 'Invalid content sharing object received' })
              return;
          }
  
          const screenShareUsingVideoCapability =
              this.contentSharing.getStartSharingUsingVideoCapability() || {};
          if (screenShareUsingVideoCapability.isAllowed) {
  
              this.startingScreenShare = true;
              console.log('Starting content video for callId = ' + this.call.getCallId())
              this.contentSharing
                  // .startScreenSharingUsingVideo(this.call.getCallId(), false)
                  .startScreenSharingUsingVideo()
                  .then(
                      () => {
                          this.startingScreenShare = true;
                          this.EventEmitter.dispatch('success', { message: 'Local content video sharing started' })
                          //    For now, we will not get callbacks from the JSCSDK. So use the API response.
                          console.log('isPresenting')
                          this.startingScreenShare = true;
                          this.emitLocalContentVideoStarted();
                      },
                      err => {
                          console.log(err)
                          this.EventEmitter.dispatch('success', { message: 'Could not start sharing local content video' })
  
                      }
                  );
          } else {
              // screen share capability denied
              if (
                  screenShareUsingVideoCapability.denialReason ===
                  'CAPABILITY_NOT_SUPPORTED'
              ) {
                  // Chrome user must be on older browser (< 72) where getDisplayMedia
                  // is not supported, try to use extension base sharing
                  this.EventEmitter.dispatch('error', { message: 'Content video sharing capability not supported, extension needed' })
                  //TO DO: this.startScreenShareWithExtension();
                  return;
              }
              this.handleScreenShareCapabilityDenials(screenShareUsingVideoCapability);
          }
      }


  getMicDevices = async () =>
    new Promise((resolve) => {
      console.log('%c getMicDevices()', 'background: #0000ff; color: #fff');
      const audioInterface = this.client.getMediaServices().getAudioInterface().getInputInterface();

      audioInterface
        .getAvailableDevices()
        .forEach((device) =>
          this.micDevices.includes(device)
            ? null
            : (this.addMicrophone(device._label, device._deviceId), this.micDevices.push(device))
        );
      console.log(this.micDevices);
      this.EventEmitter.dispatch('state', { data: { micDevices: this.micDevices } });
      this.EventEmitter.dispatch('success', { message: 'Mic devices retrieved' });
      resolve(this.micDevices);
    });

  getCameraDevices = async () =>
    new Promise((resolve) => {
      console.log('%c getCameraDevices()', 'background: #0000ff; color: #fff');
      const videoInterface = this.client.getMediaServices().getVideoInterface();

      videoInterface
        .getAvailableDevices()
        .forEach((device) =>
          this.cameraDevices.includes(device)
            ? null
            : (this.addCamera(device._label, device._deviceId), this.cameraDevices.push(device))
        );
      console.log(this.cameraDevices);
      this.EventEmitter.dispatch('state', { data: { cameraDevices: this.cameraDevices } });
      this.EventEmitter.dispatch('success', { message: 'Camera devices retrieved' });
      resolve(this.cameraDevices);
    });

  getSpeakerDevices = async () =>
    new Promise((resolve) => {
      console.log('%c getSpeakerDevices()', 'background: #0000ff; color: #fff');
      const speakersInterface = this.client
        .getMediaServices()
        .getAudioInterface()
        .getOutputInterface();

      console.log(this.client.getMediaServices());
      console.log(this.client.getMediaServices());
      console.log(speakersInterface);
      speakersInterface.getAvailableDevices().forEach((device) => {
        console.log(device);
        if (device._deviceId !== 'default' && device._deviceId !== 'communications') {
          return this.speakerDevices.includes(device)
            ? null
            : (this.addSpeaker(device._label, device), this.speakerDevices.push(device));
        }
      });
      console.log(this.speakerDevices);
      this.EventEmitter.dispatch('state', { data: { speakerDevices: this.speakerDevices } });
      this.EventEmitter.dispatch('success', { message: 'Speaker devices retrieved' });
      resolve(this.cameraDevices);
    });

  setMicrophone = (device) => {
    console.log(this.micOptions);
    console.log(this.micDevices);
    console.log('%c setMicrophone()', 'background: #0000ff; color: #fff');
    const audioInterface = this.client.getMediaServices().getAudioInterface().getInputInterface();

    console.log(audioInterface);
    console.log(device);
    audioInterface.setSelectedDevice(device);
    this.EventEmitter.dispatch('success', { message: `Microphone set to: ${device?._label}` });
  };

  setCamera = (device) => {
    console.log('%c setCamera()', 'background: #0000ff; color: #fff');
    const videoInterface = this.client.getMediaServices().getVideoInterface();

    console.log(videoInterface);
    console.log(device);
    videoInterface.setSelectedDevice(device);
    this.EventEmitter.dispatch('success', { message: `Camera set to: ${device?._label}` });
  };

  setSpeakers = (device) => {
    console.log('%c setSpeakers()', 'background: #0000ff; color: #fff');
    const speakersInterface = this.client
      .getMediaServices()
      .getAudioInterface()
      .getOutputInterface();

    console.log(speakersInterface);
    console.log(device);
    speakersInterface.setSelectedDevice(device);
    this.EventEmitter.dispatch('success', { message: `Speakers set to: ${device?._label}` });
  };

  addMicrophone = (label, deviceId) => {
    this.micOptions[this.micOptions.length] = new Option(label, deviceId);
    this.EventEmitter.dispatch('state', { data: { micOptions: this.micOptions } });
  };

  addCamera = (label, deviceId) => {
    this.cameraOptions[this.cameraOptions.length] = new Option(label, deviceId);
    this.EventEmitter.dispatch('state', { data: { cameraOptions: this.cameraOptions } });
  };

  addSpeaker = (label, deviceId) => {
    this.speakersOptions[this.speakersOptions.length] = new Option(label, deviceId);
    this.EventEmitter.dispatch('state', { data: { speakersOptions: this.speakersOptions } });
  };

  selectMic = () => {
    console.log('%c selectMic()', 'background: #0000ff; color: #fff');
    const list1 = document.getElementById('micList');

    this.setMicrophone(this.micDevices[list1.selectedIndex]);
  };

  selectCamera = () => {
    console.log('%c selectCamera()', 'background: #0000ff; color: #fff');
    const list1 = document.getElementById('cameraList');

    this.setCamera(this.cameraDevices[list1.selectedIndex]);
  };

  selectSpeakers = () => {
    console.log('%c selectSpeakers()', 'background: #0000ff; color: #fff');
    const list1 = document.getElementById('speakersList');

    this.setSpeakers(this.speakerDevices[list1.selectedIndex]);
  };

  updateScreenshareSocketPresence = (state) => {
    console.log('%c updateScreenshareSocketPresence()', 'background: #0000ff; color: #fff');
    const presencePayload = {
      category: 'app.event.presence.party.online',
      content: {
        desktop: false,
        idle: false,
        mediaSession: {
          audio: !this.audioMuted,
          connected: true,
          phone: false,
          screenshare: state,
          selfMuted: false,
          video: !this.videoMuted
        },
        offline: false,
        role: 'guest'
      },
      topicId: this.spaceId
    };

    this.socketConnection.emit('SEND_PRESENCE_EVENT', presencePayload);
  };

  // toggleScreenShareWCS = (state) => {
  //   console.log('%c toggleScreenShareWCS()', 'background: #0000ff; color: #fff');
  //   if (state) {
  //     console.log('Starting Screenshare');
  //     this.updateScreenshareSocketPresence(state);
  //     this.collaboration
  //       .getContentSharing()
  //       .startScreenSharing()
  //       .catch((err) => {
  //         console.log(`Screensharing was interrupted: ${err}`);
  //         this.onScreenShare = false;
  //         this.EventEmitter.dispatch('state', { data: { onScreenShare: this.onScreenShare } });
  //       });
  //   } else {
  //     this.updateScreenshareSocketPresence(state);
  //     this.collaboration.getContentSharing().end();
  //     this.startLocalVideo2(this.localStream);
  //   }
  // };

  startLocalVideo2 = (stream) => {
    console.log('%c startLocalVideo2()', 'background: #0000ff; color: #fff');
    console.log('Starting local video');
    const video = document.querySelector('#localVideoElement');

    video.srcObject = stream;
  };

  toggleRecording = (recordingState) => {
    console.log('%c toggleRecording()', 'background: #0000ff; color: #fff');
    if (recordingState) this.startRecordingFunction();
    else this.stopRecording();
  };

  stopRecording = () => {
    console.log(`${this.spaceId}/meetings/${this.meetingId}/recordings/${this.recordingId}/stop`);
    console.log('%c stopRecording()', 'background: #0000ff; color: #fff');
    axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId
        }/meetings/${this.meetingId}/recordings/${this.recordingId}/stop`,
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    })
      .then(() => {
        this.recording = false;
        this.EventEmitter.dispatch('state', { data: { recording: this.recording } });
      })
      .catch((err) => {
        console.log(`Stop meeting recording error: ${err}`);
      })
      .catch(() => this.EventEmitter.dispatch('error', { message: 'Could not stop recording' }));
  };

  getActiveMeeting = () => {
    console.log('%c getActiveMeeting()', 'background: #0000ff; color: #fff');
    axios({
      method: 'GET',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId
        }/activemeeting`,
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    })
      .then((res) => {
        console.log('Active meeting: ', res);
        this.meetingId = res.data._id;
        console.log('MEETING STARTED!');
        console.log(res);
        this.meetingData = res.data;
        this.EventEmitter.dispatch('state', { data: { meetingData: this.meetingData } });
        this.EventEmitter.dispatch('success', { message: 'Active meeting retrieved' });
      })
      .catch((err) => {
        this.EventEmitter.dispatch('error', { message: 'Could not retrieve active meeting' });
        console.log(`Get Meeting ID Error: ${err}`);
      });
  };

  startRecordingFunction = () => {
    console.log('%c startRecordingFunction()', 'background: #0000ff; color: #fff');
    axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId
        }/meetings/${this.meetingId}/recordings`,
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    })
      .then(() => {
        this.recording = true;
        this.EventEmitter.dispatch('state', { data: { recording: this.recording } });
      })
      .catch((err) => {
        console.log(`Recording error ${err}`);
        this.EventEmitter.dispatch('error', {
          message: 'Could not create a new chat message in a specified space'
        });
      });
  };

  getSpaceSettings = () => {
    console.log('%c getSpaceSettings()', 'background: #0000ff; color: #fff');
    axios({
      method: 'GET',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId}`,
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        Accept: 'application/json',
        'Content-type': 'application/json'
      }
    })
      .then((res) => {
        this.spaceSettings = {
          settings: res.data.settings,
          restrict: res.data.settings.restrict,
          msgRetention: res.data.settings.msgRetention,
          title: res.data.settings.title
        };
        console.log(this.spaceSettings);
        this.EventEmitter.dispatch('state', { data: { spaceSettings: this.spaceSettings } });
        this.EventEmitter.dispatch('success', { message: 'Space settings retrieved' });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        this.EventEmitter.dispatch('error', { message: 'Could not retrieve space settings' });
      });
  };

  getLocalRemoteStreams(mediaEngine, videoChannels) {
    console.log('%c getLocalRemoteStreams()', 'background: #0000ff; color: #fff');

    // const fn = `${ns}.[getLocalRemoteStreams]`;
    // get local media stream from video interface
    let localStream = mediaEngine
      .getVideoInterface()
      .getLocalMediaStream(videoChannels[0].getChannelId());

    if (!window.AvayaClientServices.Base.Utils.isDefined(localStream)) {
      // get local media stream from audio interface
      localStream = mediaEngine.getAudioInterface().getLocalMediaStream(this.call.getCallId());
    }
    if (window.AvayaClientServices.Base.Utils.isDefined(localStream)) {
      this.localStream = localStream;
      console.info(`local stream: ${localStream.id}`);
      this.EventEmitter.dispatch('success', { message: 'Local stream received' });
    }
    // get remote media stream from video interface
    let remoteStream = mediaEngine
      .getVideoInterface()
      .getRemoteMediaStream(videoChannels[0].getChannelId());

    if (!window.AvayaClientServices.Base.Utils.isDefined(remoteStream)) {
      // get remote media stream from audio interface
      remoteStream = mediaEngine.getAudioInterface().getRemoteMediaStream(this.call.getCallId());
    }
    if (window.AvayaClientServices.Base.Utils.isDefined(remoteStream)) {
      this.remoteStream = remoteStream;
      console.info(`remote stream: ${remoteStream.id}`);
      this.EventEmitter.dispatch('success', { message: 'Remote stream received' });
      this.startRemoteVideo(this.remoteStream);
    }
  }

  setSpaceSettings = (resolutionValue) => {
    console.log('%c setSpaceSettings()', 'background: #0000ff; color: #fff');

    const spaceSettings = {
      ...this.spaceSettings,
      mpaasSettings: {
        ...this.spaceSettings.mpaasSettings,
        maxResolution: resolutionValue
      }
    };

    axios({
      method: 'POST',
      url: 'http://localhost:3001/space_settings',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      data: {
        spaceSettings,
        spaceId: this.spaceId,
        tokenType: this.tokenType,
        token: this.token
      }
    })
      .then((res) => {
        this.spaceSettings = res;
        console.log(this.spaceSettings);
        this.EventEmitter.dispatch('state', {
          data: { spaceSettings: this.spaceSettings, showSpaceSettingsModal: false }
        });
        this.EventEmitter.dispatch('success', { message: 'Space settings changed successfully' });
        console.log(res);
      })
      .catch((err) => {
        this.EventEmitter.dispatch('error', { message: 'Could not change space settings' });
        console.log(err);
      });
  };

  setVideoResolution = (resolutionValue) => {
    this.updateVideoModeAndReceiveResolution(resolutionValue);
  };

  getJSCSDKVideoResolution = (spacesVideoResolution) => {
    console.log('%c getJSCSDKVideoResolution()', 'background: #0000ff; color: #fff');
    this.EventEmitter.dispatch('success', {
      message: `Current video resolution: ${spacesVideoResolution}`
    });
    switch (spacesVideoResolution) {
      case this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_1080P:
        return window.AvayaClientServices.Config.VideoResolution.RESOLUTION_1080p;
      case this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_720P:
        return window.AvayaClientServices.Config.VideoResolution.RESOLUTION_720p;
      case this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_480P:
        return window.AvayaClientServices.Config.VideoResolution.RESOLUTION_480p;
      case this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_360P:
        return window.AvayaClientServices.Config.VideoResolution.RESOLUTION_360p;
      case this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_240P:
        return window.AvayaClientServices.Config.VideoResolution.RESOLUTION_240p;
      case this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_180P:
        return window.AvayaClientServices.Config.VideoResolution.RESOLUTION_180p;
      default:
        return window.AvayaClientServices.Config.VideoResolution.RESOLUTION_720p;
    }
  };

  getVideoResolution = (jscsdkVideoResolution) => {
    switch (jscsdkVideoResolution) {
      case window.AvayaClientServices.Config.VideoResolution.RESOLUTION_1080p:
        return this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_1080P;
      case window.AvayaClientServices.Config.VideoResolution.RESOLUTION_720p:
        return this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_720P;
      case window.AvayaClientServices.Config.VideoResolution.RESOLUTION_480p:
        return this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_480P;
      case window.AvayaClientServices.Config.VideoResolution.RESOLUTION_360p:
        return this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_360P;
      case window.AvayaClientServices.Config.VideoResolution.RESOLUTION_240p:
        return this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_240P;
      case window.AvayaClientServices.Config.VideoResolution.RESOLUTION_180p:
        return this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_180P;
      default:
        return this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_720P;
    }
  };

  isSupportedVideoResolution = (videoResolution) => {
    console.log('%c isSupportedVideoResolution()', 'background: #0000ff; color: #fff');

    return Object.keys(this.VIDEO_RESOLUTIONS).find(
      (key) => this.VIDEO_RESOLUTIONS[key].value === videoResolution
    );
  };

  async updateVideoModeAndReceiveResolution(videoResolution) {
    console.log('%c updateVideoModeAndReceiveResolution()', 'background: #0000ff; color: #fff');

    if (
      !this.call ||
      this.call.getState() !== window.AvayaClientServices.Services.Call.CallStates.ESTABLISHED
    ) {
      if (this.call) {
        console.log(`call state ${this.call.getState()}`);
      }

      return this.EventEmitter.dispatch('error', {
        message: "Can't update video mode. Call is not ready"
      });
    }

    const vChannels = this.call.getVideoChannels();

    if (!vChannels || vChannels.length === 0) {
      return this.EventEmitter.dispatch('error', {
        message: "Can't update video mode. Video channels are not available"
      });
    }

    if (!this.isSupportedVideoResolution(videoResolution)) {
      return this.EventEmitter.dispatch('error', {
        message: `Can't update video mode. Video resolution at ${videoResolution} is not supported`
      });
    }

    if (videoResolution === this.VIDEO_RESOLUTION.VIDEO_RESOLUTION_NO_VIDEO) {
      // Disable video
      this.EventEmitter.dispatch('success', { message: 'Disabling video' });

      const disableVideoCapability = this.call.getUpdateVideoModeDisableCapability();

      if (disableVideoCapability.isAllowed) {
        await this.call
          .setVideoMode(window.AvayaClientServices.Services.Call.VideoMode.DISABLE)
          .then(
            () => {
              this.EventEmitter.dispatch('success', {
                message: 'Video disabled - audio only call'
              });
              this.isAudioCall = true;
              this.emitVideoResolutionChanged(videoResolution);
            },
            (err) => {
              this.EventEmitter.dispatch('error', {
                message: `Change video resolution to ${videoResolution} failed: ${err}`
              });
            }
          );
      } else {
        this.EventEmitter.dispatch('error', {
          message: `VideoModeDisableCapability isAllowed === false, reason: ${disableVideoCapability.denialReason}`
        });
      }

      return;
    }
    const mediaDirection = vChannels[0].getNegotiatedDirection();

    console.info(`negotiatedDirection: ${mediaDirection}`);
    if (mediaDirection === window.AvayaClientServices.Services.Call.MediaDirection.INACTIVE) {
      // Enable video if its disabled
      this.EventEmitter.dispatch('success', { message: 'Enabling video' });
      const sendReceiveCapability = this.call.getUpdateVideoModeSendReceiveCapability();

      console.log(sendReceiveCapability);
      if (sendReceiveCapability.isAllowed) {
        await this.call
          .setVideoMode(window.AvayaClientServices.Services.Call.VideoMode.SEND_RECEIVE)
          .then(
            () => {
              this.EventEmitter.dispatch('success', {
                message: 'Video mode changed to SEND_RECEIVE'
              });
              this.isAudioCall = false;
            },
            (err) => {
              this.EventEmitter.dispatch('error', {
                message: `${err?._protocolErrorReason ||
                  `Change video resolution to ${videoResolution} failed - change to SEND_RECEIVE`
                  }`
              });
            }
          );
      }
      const jscsdkVideoResolution = this.getJSCSDKVideoResolution(videoResolution);

      this.setPreferredVideoReceiveResolution(jscsdkVideoResolution);
    }
  }

  setPreferredVideoReceiveResolution(videoResolution) {
    if (
      !this.call ||
      this.call.getState() !== window.AvayaClientServices.Services.Call.CallStates.ESTABLISHED
    ) {
      if (this.call) {
        console.log(`call state ${this.call.getState()}`);
      }
      this.EventEmitter.dispatch('error', {
        message: 'Call is not ready, ignoring resolution change request.'
      });

      return;
    }

    const videoChannels = this.call.getVideoChannels();

    if (videoChannels && videoChannels.length > 0) {
      const capability = videoChannels[0].getUpdatePreferredReceiveResolutionCapability();

      if (capability.isAllowed) {
        videoChannels[0].setPreferredReceiveResolution(videoResolution).then(
          () => {
            this.EventEmitter.dispatch('success', {
              message: `Video receive resolution set ${videoResolution}`
            });
          },
          (error) => {
            const errMsg = error.getError() || error;

            this.EventEmitter.dispatch('error', {
              message: `Error set video receive resolution: ${errMsg}`
            });
          }
        );
      } else {
        this.EventEmitter.dispatch('error', {
          message: `Unable to set receive video resolution: ${capability?.denialReason}`
        });
      }
    } else {
      this.EventEmitter.dispatch('error', { message: 'Video channels are not available' });
    }
  }

  isConnected = (id) => this.spaceMembers[id].content.mediaSession.connected === true;

  isConnecting = () => this.call.getState() === 'initiating';

  isCallStateConnected = () => this.call.getState() === 'established';

  createMeetingInfoTXT = (meeting) => {
    const { startTime, endTime, attendees } = meeting.content;
    // TODO: Create follow the template below
    const fileObj = attendees
      .map(
        (item) =>
          `${item.displayname} ${item.username} ${moment(item.joinTime).format(
            'YYYY-MM-DD HH:mm:ss'
          )}`
      )
      .join('\n');

    console.log(fileObj);
    const file = `
Avaya Spaces Meeting 
        
Space name: ${this.spaceTitle}
Report generated on: ${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}
Start Time: ${moment(startTime).format('YYYY-MM-DD HH:mm:ss')}
End Time: ${moment(endTime).format('YYYY-MM-DD HH:mm:ss')}
Participants:
        
Name, Email, Joining Time
${fileObj}
        `;
    const blob = new Blob([file], { type: 'text/plain;charset=utf-8' });

    saveFile(blob, 'meeting-info.txt');
  };

  initiateDigitalCall = async (callee) =>
    new Promise((resolve, reject) => {
      this.joinDirectSpace(callee._id)
        .then(() => {
          const mediaSessionEvents = {
            topicId: this.spaceId,
            category: 'space.call.offer',
            sender: this.sender,
            data: [],
            version: '1.1',
            content: {
              subscribeTime: this.spaceContent?.subscribedTime || new Date().toISOString(),
              mediaSession: {}
            },
            created: new Date().toISOString(),
            receivers: [callee],
            topicTitle: callee?.displayname
          };

          this.diallingTone.play();

          this.socketConnection.on('CHANNEL_SUBSCRIBED', () => {
            this.EventEmitter.dispatch('state', { data: { channelSubscribed: true } });
            this.socketConnection.emit('SEND_MEDIA_SESSION_EVENTS', mediaSessionEvents);
            resolve();
          });
        })
        .catch((err) => {
          reject(err);
        });
    });

  cancelDigitalCall = () => {
    const cancelSpaceCallObj = {
      topicId: this.spaceId,
      category: 'space.call.cancelled',
      sender: this.sender,
      data: [],
      version: '1.1',
      content: {
        subscribeTime: this.spaceContent?.subscribedTime || new Date().toISOString(),
        mediaSession: {}
      },
      created: new Date().toISOString(),
      receivers: [this.callee],
      topicTitle: this.callee?.displayname
    };

    this.diallingTone.pause();
    this.EventEmitter.dispatch('state', { data: { showModalDigitalCall: false } });
    this.socketConnection.emit('SEND_MEDIA_SESSION_EVENTS', cancelSpaceCallObj);
  };

  endDigitalCall = () => {
    this.diallingTone.pause();
    this.EventEmitter.dispatch('state', { data: { showModalDigitalCall: false } });
  };

  declineDigitalCall = (callerObj) => {
    console.log(callerObj);
    const declineDigitalCallObj = {
      spaceCallId: callerObj?.spaceCallId,
      meetingId: callerObj?.callerObj,
      topicId: callerObj?.topicId,
      category: 'space.call.rejected',
      receivers: [callerObj?.sender],
      sender: this.sender,
      content: {
        subscribeTime: this.spaceContent?.subscribedTime || new Date().toISOString(),
        mediaSession: {}
      },
      version: '1.1'
    };

    console.log(declineDigitalCallObj);
    this.ringTone.pause();
    this.EventEmitter.dispatch('state', { data: { showIncomingCallModal: false } });
    this.socketConnection.emit('SEND_MEDIA_SESSION_EVENTS', declineDigitalCallObj);
  };

  acceptDigitalCall = (val) => {
    this.spaceId = val.topicId;
    const acceptSpaceCallObj = {
      spaceCallId: val.spaceCallId,
      meetingId: val.meetingId,
      topicId: val.topicId,
      category: 'space.call.accepted',
      receivers: [val.sender],
      sender: this.sender,
      content: {
        subscribeTime: new Date().toISOString(),
        mediaSession: {}
      },
      version: '1.1'
    };

    this.socketConnection.emit('SEND_MEDIA_SESSION_EVENTS', acceptSpaceCallObj);
    this.joinSpace(val.topicId).then(() => {
      this.initiateSpacesCall();
      this.diallingTone.pause();
      this.EventEmitter.dispatch('state', { data: { showModalDigitalCall: false } });
    });
  };

  setCurrentLayout = (layout) => {
    const data = { layout };

    if (layout === 'THEME') {
      data.backgroundTheme = 'CAFE';
    }

    return axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId
        }/meetings/${this.meetingId}/layout`,
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      data
    }).then(
      (res) => {
        console.log(res);
        this.EventEmitter.dispatch('success', { message: `Layout ${layout} set` });
      },
      (err) => {
        this.EventEmitter.dispatch('error', { message: `Error while setting layout: ${err}` });
        reject(err);
      }
    );
  };

  setCurrentBackgroundTheme = (backgroundTheme) =>
    axios({
      method: 'POST',
      url: `https://${localStorage.getItem('spaces_apis')}.com/api/spaces/${this.spaceId
        }/meetings/${this.meetingId}/layout`,
      headers: {
        Authorization: `${this.tokenType} ${this.token}`,
        Accept: 'application/json',
        'Content-type': 'application/json'
      },
      data: { layout: 'THEME', backgroundTheme }
    })
      .then((res) => {
        console.error(res);
        this.EventEmitter.dispatch('success', { message: `Theme ${backgroundTheme} set` });
      })
      .catch((err) => {
        console.error(err);
        this.EventEmitter.dispatch('error', { message: `Error while setting theme: ${err}` });
        reject(err);
      });

  setBackgroundImage = () => {
    this.backgroundImage = new Image();
    this.backgroundImage.src = '/background-image.jpg';
    if (this.checkBackgroundImageCapability()) {
      this.EventEmitter.dispatch('error', {
        message: `Capability for background image denied. Reason: ${this.backgroundImageCapability?.denialReason}`
      });

      return;
    }

    this.call.setBackgroundImage(this.backgroundImage).then(
      () => {
        console.log('Background image set success');
        this.EventEmitter.dispatch('success', { message: 'Background image set' });
      },
      (err) => {
        this.EventEmitter.dispatch('error', {
          message: `Error in setting background image: ${err}`
        });
      }
    );
  };

  stopBackgroundImage = () => {
    if (this.checkBackgroundImageCapability()) {
      this.EventEmitter.dispatch('error', {
        message: `Capability for background image denied. Reason: ${this.backgroundImageCapability.denialReason}`
      });

      return;
    }

    this.call.setBackgroundImage().then(
      () => {
        console.log('Background image unset success');
      },
      (err) => {
        this.EventEmitter.dispatch('error', {
          message: `Error in unsetting background image: ${err}`
        });
      }
    );
  };

  setBackgroundBlur = () => {
    if (this.checkBackgroundBlurCapability()) {
      this.EventEmitter.dispatch('error', {
        message: `Capability for background blur is denied. Reason: ${this.backgroundBlurCapability?.denialReason}`
      });

      return;
    }

    this.call.setBackgroundBlur(true).then(
      () => {
        console.log('Background blur set success');
        this.EventEmitter.dispatch('success', { message: 'Background blur set' });
      },
      (err) => {
        this.EventEmitter.dispatch('error', {
          message: `Error in setting background blur: ${err}`
        });
      }
    );
  };

  stopBackgroundBlur = () => {
    if (this.checkBackgroundBlurCapability()) {
      this.EventEmitter.dispatch('error', {
        message: `Capability for background blur is denied. Reason: ${this.backgroundBlurCapability?.denialReason}`
      });

      return;
    }

    this.call.setBackgroundBlur(false).then(
      () => {
        console.log('Background blur unset success');
      },
      (err) => {
        this.EventEmitter.dispatch('eror', {
          message: `Error in unsetting background blur: ${err}`
        });
      }
    );
  };
}
