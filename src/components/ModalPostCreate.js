import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { toggleModalPostCreate, validatePost } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({ showModalPostCreate: state.data.showModalPostCreate });

function ModalPostCreate(props) {
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [postName, setPostName] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const { showModalPostCreate } = props;

  return (
    <div>
      <Modal
        show={showModalPostCreate}
        dialogClassName="custom-dialog"
        animation={false}
        onHide={() => null}
      >
        <Modal.Header>
          <Modal.Title>Create a post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Post name:</p>
          <input
            className="form-control"
            type="text"
            value={postName}
            onChange={(event) => setPostName(event.target.value)}
          />
          <p>Description:</p>
          <input
            className="form-control"
            type="text"
            value={postDescription}
            onChange={(event) => setPostDescription(event.target.value)}
          />
          <p>Attach:</p>
          <div>
            <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              props.toggleModalPostCreate(!showModalPostCreate);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.validatePost({ postName, postDescription, selectedFile });
            }}
          >
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default connect(mapStateToProps, { toggleModalPostCreate, validatePost })(ModalPostCreate);
