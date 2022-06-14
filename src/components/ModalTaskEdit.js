import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';

import { connect } from 'react-redux';
import { toggleModalTaskEdit, sendEditedTask } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  showModalTaskEdit: state.data.showModalTaskEdit,
  taskCurrentlyEdited: state.data.taskCurrentlyEdited
});

function ModalTaskEdit(props) {
  const [selectedFile, setSelectedFile] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const { showModalTaskEdit, taskCurrentlyEdited } = props;

  const editedTask = {
    ...taskCurrentlyEdited,
    content: {
      ...taskCurrentlyEdited?.content,
      data: selectedFile,
      description: taskDescription,
      bodyText: taskName,
      dueDate: taskDate
    }
  };

  useEffect(() => {
    setSelectedFile(taskCurrentlyEdited?.content?.data || '');
    setTaskName(taskCurrentlyEdited?.content?.bodyText || '');
    setTaskDescription(taskCurrentlyEdited?.content?.description || '');
    setTaskDate(taskCurrentlyEdited?.content?.dueDate || '');
  }, [taskCurrentlyEdited]);

  return (
    <div>
      <Modal
        show={showModalTaskEdit}
        dialogClassName="custom-dialog"
        animation={false}
        onHide={() => null}
      >
        <Modal.Header>
          <Modal.Title>Edit a task</Modal.Title>
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
          <DayPickerInput
            placeholder={moment(taskDate).format('YYYY-MM-DD')}
            onDayChange={(day) => setTaskDate(new Date(day).toISOString())}
          />
          <br />
          <br />
          <p>Attachments:</p>
          <div>
            {selectedFile[0]?.name ? (
              <p>
                <a href={selectedFile[0].path}>{selectedFile[0].name}</a>
                <Button onClick={() => setSelectedFile([])}> X</Button>
              </p>
            ) : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              props.toggleModalTaskEdit(!showModalTaskEdit);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.sendEditedTask({ editedTask });
              setSelectedFile([]);
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

export default connect(mapStateToProps, { toggleModalTaskEdit, sendEditedTask })(ModalTaskEdit);
