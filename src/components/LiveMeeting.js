import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import { endMeeting, presetCall } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  conferenceCall: state.data.conferenceCall,
  meetingData: state.data.meetingData,
  me: state.data.me,
  spaceMembers: state.data.spaceMembers
});

function LiveMeeting(props) {
  const { meetingData, spaceMembers, me, conferenceCall } = props;
  const { content } = meetingData || {};
  const { startTime, bodyText, attendees, sender } = content || {};

  useEffect(() => {
    console.log(meetingData);
  }, [spaceMembers, me, meetingData]);

  const iAmAdmin =
    (spaceMembers[me._id || me.member] !== undefined &&
      spaceMembers[me._id || me.member].role === 'admin') ||
    false;

  return (
    meetingData && (
      <div className="liveMeeting">
        <h5>Live meeting</h5>
        <p>
          <b>Started: {moment(startTime).format('HH:mm')}</b>
        </p>
        <p>{bodyText}</p>
        <p>{sender?.displayname}</p>
        <div className="row">
          <div className="col">
            <span className="chat-message__avatar-frame">
              {attendees?.map((item, idx) => (
                <img
                  src={item.picture_url}
                  alt="avatar"
                  key={idx}
                  className="chat-message__avatar"
                />
              ))}
            </span>
          </div>
          <div className="col">
            {iAmAdmin && (
              <Button variant="danger" onClick={() => props.endMeeting()}>
                End Meeting
              </Button>
            )}
            {conferenceCall === null && (
              <Button variant="success" onClick={() => props.presetCall()}>
                Join Meeting
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default connect(mapStateToProps, { endMeeting, presetCall })(LiveMeeting);
