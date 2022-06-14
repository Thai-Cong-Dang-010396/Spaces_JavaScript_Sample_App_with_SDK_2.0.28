import React from 'react';
import { connect } from 'react-redux';
import { selectCamera, selectMic, selectSpeakers } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  cameraOptions: state.data.cameraOptions,
  micOptions: state.data.micOptions,
  speakersOptions: state.data.speakersOptions
});

function DeviceSelectionBody(props) {
  const { cameraOptions, micOptions, speakersOptions } = props;

  return (
    <div>
      <p> Select the audio and video devices from the list below:</p>
      <div>
        <label htmlFor="cameraList" className="control-label">
          <i className="fas fa-video" aria-hidden="true" />
          &nbsp;Camera
        </label>
        <select
          className="form-control"
          id="cameraList"
          onChange={(e) => props.selectCamera(e.target.value)}
        >
          {cameraOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.text}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="micList" className="control-label">
          <i className="fas fa-microphone" />
          &nbsp;Microphone
        </label>
        <select
          className="form-control"
          id="micList"
          onChange={(e) => props.selectMic(e.target.value)}
        >
          {micOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.text}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="speakerList" className="control-label">
          <i className="fas fa-volume" />
          &nbsp;Speaker
        </label>
        <select
          className="form-control"
          id="speakersList"
          onChange={(e) => props.selectSpeakers(e.target.value)}
        >
          {speakersOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.text}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, { selectCamera, selectMic, selectSpeakers })(
  DeviceSelectionBody
);
