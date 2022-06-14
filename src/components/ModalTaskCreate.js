import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import { connect } from 'react-redux';
import { toggleModalTaskCreate, sendTask } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({ showModalTaskCreate: state.data.showModalTaskCreate });

function TaskModal(props) {
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const { showModalTaskCreate } = props;

  return (
    <div>
      <Modal
        show={showModalTaskCreate}
        dialogClassName="custom-dialog"
        animation={false}
        onHide={() => null}
      >
        <Modal.Header>
          <Modal.Title>Create a task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Task name:</p>
          <input
            className="form-control"
            type="text"
            value={taskName}
            onChange={(event) => setTaskName(event.target.value)}
          />
          <p>Description:</p>
          <input
            className="form-control"
            type="text"
            value={taskDescription}
            onChange={(event) => setTaskDescription(event.target.value)}
          />
          <p>Due date:</p>
          <DayPickerInput onDayChange={(day) => setTaskDate(new Date(day).toISOString())} />
          <br />
          <br />
          <p>Attach:</p>
          <div>
            <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              props.toggleModalTaskCreate(!showModalTaskCreate);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.sendTask({ taskName, taskDescription, taskDate, selectedFile });
              setSelectedFile(undefined);
              setTaskName('');
              setTaskDescription('');
              setTaskDate('');
            }}
          >
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default connect(mapStateToProps, { toggleModalTaskCreate, sendTask })(TaskModal);
