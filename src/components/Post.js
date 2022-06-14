import React from 'react';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { toggleModalPostEdit, deletePost } from '../redux/actions/spaceActions';

function Post(props) {
  return (
    <div className="post">
      <p>📰{props.post.content.bodyText}</p>
      <p>{props.post.sender.displayname}</p>
      <p className="createdOn">
        Created: {moment(props.post.created).format('YYYY-MM-DD HH:mm:ss')}
      </p>
      {props.editable && (
        <Button className="m-0" onClick={() => props.toggleModalPostEdit(true, props.post)}>
          Edit
        </Button>
      )}
      {props.editable && (
        <Button className="ml-1" variant="danger" onClick={() => props.deletePost(props.post)}>
          Delete
        </Button>
      )}
    </div>
  );
}

export default connect(null, { toggleModalPostEdit, deletePost })(Post);
