import React from 'react';
import { Button } from 'react-bootstrap';
import moment from 'moment';
import 'moment-duration-format';
import { connect } from 'react-redux';
import { handleDownloadMeetingInfo } from '../redux/actions/spaceActions';

function Meeting(props) {
  const { endTime, startTime, bodyText, attendees, data } = props.item.content;
  const diff = moment(endTime).diff(moment(startTime));
  const duration = moment.utc(diff).format('H[h], m[min], s[sec]');

  if (endTime === null) return null;
  return (
    <div className="meeting">
      <p className="startTime"> Start time: {moment(startTime).format('YYYY-MM-DD HH:mm:ss')}</p>
      <p className="endTime"> End time: {moment(endTime).format('YYYY-MM-DD HH:mm:ss')}</p>
      <p className="duration"> Duration: {duration}</p>
      <p>{bodyText}</p>
      <p>{props.item.sender.displayname}</p>
      <p>
        <span className="chat-message__avatar-frame">
          Attendees:{' '}
          {attendees.map((item, idx) => (
            <img src={item.picture_url} alt="avatar" key={idx} className="chat-message__avatar" />
          ))}
        </span>
      </p>
      {data.map((item, idx) => (
        <div key={idx}>
          <p>Recording: </p>
          <video width="320" height="240" controls>
            <source src={item.path} type={item.providerFileType} />
            Your browser does not support the video tag.
          </video>
          <a href={item.path} download>
            <Button>Download</Button>{' '}
          </a>
        </div>
      ))}
      <Button className="m-0" onClick={() => props.handleDownloadMeetingInfo(props.item)}>
        Meeting Report
      </Button>
    </div>
  );
}
export default connect(null, { handleDownloadMeetingInfo })(Meeting);
