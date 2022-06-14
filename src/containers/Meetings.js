import React from 'react';
import { connect } from 'react-redux';
import Meeting from '../components/Meeting';

const mapStateToProps = (state) => ({ spaceMeetings: state.data.spaceMeetings });

function Meetings(props) {
  return (
    <div className="meetings-container">
      <div className="log">
        {props.spaceMeetings &&
          props.spaceMeetings.map((item, idx) => <Meeting item={item} key={idx} />)}
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(Meetings);
