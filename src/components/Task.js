import React from 'react';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { toggleModalTaskEdit, deleteTask } from '../redux/actions/spaceActions';

function Task(props) {
  return (
    <div className="post">
      <p>✔️{props.task.content.bodyText}</p>
      <p>{props.task.sender.displayname}</p>
      <p className="createdOn">
        Created: {moment(props.task.created).format('YYYY-MM-DD HH:mm:ss')}
      </p>
      <p className="dueDate">Due date: {moment(props.task.content.dueDate).format('YYYY-MM-DD')}</p>
      {props.editable && (
        <Button className="m-0" onClick={() => props.toggleModalTaskEdit(true, props.task)}>
          Edit
        </Button>
      )}
      {props.editable && (
        <Button className="ml-1" variant="danger" onClick={() => props.deleteTask(props.task)}>
          Delete
        </Button>
      )}
    </div>
  );
}

export default connect(null, { toggleModalTaskEdit, deleteTask })(Task);
