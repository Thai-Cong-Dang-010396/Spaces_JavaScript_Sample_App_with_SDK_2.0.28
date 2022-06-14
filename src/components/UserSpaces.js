import React from 'react';
import { connect } from 'react-redux';
import { ReactComponent as StartOutlined } from '../assets/img/star-outlined.svg';
import { ReactComponent as StartFilled } from '../assets/img/star-filled.svg';
import { toggleSpacePinned } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({ mySpaces: state.data.mySpaces });

function UserSpaces(props) {
  const { mySpaces } = props;

  return (
    <div className="userSpaces">
      {mySpaces &&
        Object.keys(mySpaces).map((item) => (
          <p key={item} className="user-space">
            <span
              className="user-space-text"
              onClick={() => window.SampleAvayaSpacesSDK.joinSpace(mySpaces[item]._id)}
            >
              {mySpaces[item].title}
            </span>
            {mySpaces[item].isPinned ? (
              <StartFilled
                onClick={() =>
                  props.toggleSpacePinned({ spaceId: mySpaces[item]._id, isPinned: false })
                }
              />
            ) : (
              <StartOutlined
                onClick={() =>
                  props.toggleSpacePinned({ spaceId: mySpaces[item]._id, isPinned: true })
                }
              />
            )}
          </p>
        ))}
    </div>
  );
}

export default connect(mapStateToProps, { toggleSpacePinned })(UserSpaces);
