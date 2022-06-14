import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Task from '../components/Task';
import { toggleModalTaskCreate } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  spaceTasks: state.data.spaceTasks,
  me: state.data.me
});

function Tasks(props) {
  return (
    <div className="tasks-container">
      <Button onClick={() => props.toggleModalTaskCreate(true)}>+ New Task</Button>
      <div className="log">
        {props.spaceTasks &&
          props.spaceTasks.map((task, idx) => (
            <Task task={task} key={idx} editable={task.sender._id === props.me._id} />
          ))}
      </div>
    </div>
  );
}

export default connect(mapStateToProps, { toggleModalTaskCreate })(Tasks);
