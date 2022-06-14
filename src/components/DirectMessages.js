import React from 'react';
import { connect } from 'react-redux';
import DMSearchBar from './DMSearchBar';
import { joinDirectSpace, initiateDigitalCall } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => {
  const { data } = state;

  return { peopleWithDM: data.peopleWithDM };
};

function DirectMessages(props) {
  const { peopleWithDM } = props;

  return (
    <div className="memberList">
      <h4>Direct messages:</h4>
      {Object.keys(peopleWithDM).map((member) => (
        <div key={peopleWithDM[member]._id} className="space-member space-member-dm">
          <img
            src={peopleWithDM[member].picture_url}
            alt="profile"
            className="space-member__avatar"
          />{' '}
          <p
            className="space-member__displayname"
            onClick={() => {
              props.joinDirectSpace(peopleWithDM[member]._id);
            }}
          >
            {peopleWithDM[member].displayname}
          </p>
          <p className="space-member__username">
            {peopleWithDM[member].username}{' '}
            <span
              className="neo-icon-video"
              onClick={() => {
                props.initiateDigitalCall(peopleWithDM[member]);
              }}
            />
          </p>
        </div>
      ))}
      <DMSearchBar contactClickAction="joinDirectSpace" />
    </div>
  );
}

export default connect(mapStateToProps, { joinDirectSpace, initiateDigitalCall })(DirectMessages);
