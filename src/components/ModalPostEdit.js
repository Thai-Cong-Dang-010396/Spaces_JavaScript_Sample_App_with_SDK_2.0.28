import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { toggleModalPostEdit, sendEditedPost } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  showModalPostEdit: state.data.showModalPostEdit,
  postCurrentlyEdited: state.data.postCurrentlyEdited
});

function ModalPostEdit(props) {
  const [selectedFile, setSelectedFile] = useState('');
  const [postName, setPostName] = useState('');
  const [postDescription, setPostDescription] = useState('');

  const { showModalPostEdit, postCurrentlyEdited } = props;

  const editedPost = {
    ...postCurrentlyEdited,
    content: {
      ...postCurrentlyEdited?.content,
      data: selectedFile,
      description: postDescription,
      bodyText: postName
    }
  };

  useEffect(() => {
    setSelectedFile(postCurrentlyEdited?.content?.data || '');
    setPostName(postCurrentlyEdited?.content?.bodyText || '');
    setPostDescription(postCurrentlyEdited?.content?.description || '');
  }, [postCurrentlyEdited]);

  return (
    <div>
      <Modal
        show={showModalPostEdit}
        dialogClassName="custom-dialog"
        animation={false}
        onHide={() => null}
      >
        <Modal.Header>
          <Modal.Title>Edit the post</Modal.Title>
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
              props.toggleModalPostEdit(!showModalPostEdit);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.sendEditedPost({ editedPost });
              setSelectedFile('');
              setPostName('');
              setPostDescription('');
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default connect(mapStateToProps, { toggleModalPostEdit, sendEditedPost })(ModalPostEdit);
