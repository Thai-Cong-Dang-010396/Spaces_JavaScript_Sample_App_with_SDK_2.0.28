import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import {
  muteAll,
  acceptRaisedHand,
  lowerRaisedHand,
  raiseHand,
  muteMember
} from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  spaceMembers: state.data.spaceMembers,
  activeSpeaker: state.data.activeSpeaker,
  me: state.data.me,
  conferenceCall: state.data.conferenceCall,
  userRaisedHand: state.data.userRaisedHand
});

function SpaceMembersList(props) {
  const { spaceMembers, activeSpeaker, me, conferenceCall, userRaisedHand } = props;

  useEffect(() => {}, [me, activeSpeaker, conferenceCall, spaceMembers]);

  useEffect(() => {}, [userRaisedHand]);

  const conferenceIsLive = conferenceCall !== null;
  const iAmAdmin =
    (spaceMembers[me._id || me.member] !== undefined &&
      spaceMembers[me._id || me.member].role === 'admin') ||
    false;

  function AnimatedSound() {
    return <i className="neo-icon-sound neo-icon-sound-animated" />;
  }
  function SoundOff() {
    return <i className="neo-icon-audio-off" />;
  }
  function VideoOn() {
    return <i className="neo-icon-video" />;
  }
  function VideoOff() {
    return <i className="neo-icon-video-off" />;
  }

  const userIsOnline = (id) => {
    if (spaceMembers[id].content) {
      if (
        !spaceMembers[id].offline ||
        spaceMembers[id].content.mediaSession.connected ||
        spaceMembers[id].status === 'online' ||
        (id === me._id && conferenceIsLive)
      ) {
        return true;
      }
      return false;
    }
    return false;
  };

  const displayMuteAll = (id) => {
    if (id === me._id && iAmAdmin && conferenceIsLive) {
      return <Button onClick={() => props.muteAll()}>Mute All</Button>;
    }
    return null;
  };

  const displayRaisedHandPrompt = (id) => {
    if (iAmAdmin && id === userRaisedHand) {
      return (
        <p>
          ✋ Accept raised hand?
          <Button
            onClick={() =>
              props.acceptRaisedHand({
                attendeeId: id,
                attendeeType: spaceMembers[id].role || spaceMembers[id].type
              })
            }
          >
            Yes
          </Button>
          <Button
            onClick={() =>
              props.lowerRaisedHand({
                attendeeId: id,
                attendeeType: spaceMembers[id].role || spaceMembers[id].type
              })
            }
          >
            No
          </Button>
        </p>
      );
    }
    return null;
  };

  const displayRaiseHand = (id) => {
    if (!iAmAdmin && id === me._id && conferenceIsLive) {
      return <Button onClick={() => props.raiseHand()}>Raise Hand ✋</Button>;
    }
    return null;
  };

  const displayUserMediaState = (id) => {
    let audio = false;
    let video = false;

    if (conferenceIsLive) {
      if (spaceMembers[id].content !== undefined) {
        if (spaceMembers[id].content.mediaSession !== undefined) {
          audio = spaceMembers[id].content.mediaSession.audio;
          video = spaceMembers[id].content.mediaSession.video;

          return [
            video === true ? VideoOn : VideoOff,

            audio ? (
              activeSpeaker === id ? (
                AnimatedSound
              ) : (
                <i
                  className="neo-icon-audio"
                  onClick={
                    iAmAdmin
                      ? () =>
                          props.muteMember({
                            attendeeId: id,
                            attendeeType: spaceMembers[id].role || spaceMembers[id].type
                          })
                      : null
                  }
                />
              )
            ) : (
              SoundOff
            )
          ];
        }
        return null;
      }
      return null;
    }
    return null;
  };

  return (
    <div className="memberList">
      {Object.keys(spaceMembers).map((id, index) => (
        <div key={index} className="space-member">
          <img src={spaceMembers[id].picture_url} alt="profile" className="space-member__avatar" />
          {userIsOnline(id) && <span className="space-member--online" />}
          <p className="space-member__displayname"> {spaceMembers[id].displayname}</p>
          {displayMuteAll(id)}
          <p className="space-member__username">
            {spaceMembers[id].username}
            <span className="space-member__role">
              {' '}
              ({spaceMembers[id].role || spaceMembers[id].type})
            </span>
            {displayRaisedHandPrompt(id)}
            {displayRaiseHand(id)}
            {displayUserMediaState(id)}
          </p>
          {}
        </div>
      ))}
    </div>
  );
}

export default connect(mapStateToProps, {
  muteAll,
  acceptRaisedHand,
  lowerRaisedHand,
  raiseHand,
  muteMember
})(SpaceMembersList);
