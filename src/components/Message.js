import { connect } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { deleteMessage, sendEditedMessage, sendMessage } from '../redux/actions/spaceActions';
import { trimHTML } from '../utils/index';

const mapStateToProps = (state) => ({ me: state.data.me });

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <span
    className="caret"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </span>
));

function Message(props) {
  const [isEditing, setIsEditing] = useState(false);
  const { sender, avatarURL, messageTxt, createdOn, me, data, message } = props;
  const [editedMessage, setEditedMessage] = useState(trimHTML(messageTxt));

  const createMarkup = () => ({ __html: messageTxt });

  const handleEditMessage = (e) => {
    const trimmed = trimHTML(e.target.value);

    setEditedMessage(trimmed);
  };

  const handleKeyPress = (e) => {
    console.log(e.target.value);
    if (e.key === 'Enter') {
      props.sendEditedMessage({ previousMessage: message, editedMessage });
      setIsEditing(false);
    }
  };

  return (
    <div className={`chat-message ${sender === me._id && 'chat-message--right'} `}>
      <span className="chat-message__avatar-frame">
        <img src={avatarURL} alt="avatar" className="chat-message__avatar" />
      </span>
      {isEditing ? (
        <span>
          <input
            value={editedMessage}
            onChange={(e) => handleEditMessage(e)}
            onKeyPress={handleKeyPress}
          />
          <Button
            variant="success"
            size="sm"
            onClick={() => {
              props.sendEditedMessage({ previousMessage: message, editedMessage });
              setIsEditing(false);
            }}
          >
            Submit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setIsEditing(false);
            }}
          >
            X
          </Button>
        </span>
      ) : (
        <div>
          {data.length ? (
            <a href={data[0].path} download={data[0].name}>
              <p className="chat-message__text">{data[0].name}</p>
            </a>
          ) : (
            <p className="chat-message__text" dangerouslySetInnerHTML={createMarkup()} />
          )}
          <p className="createdOn">
            {createdOn}
            {sender === me._id && (
              <Dropdown className="d-inline">
                <Dropdown.Toggle as={CustomToggle} />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => props.deleteMessage(message)}>Delete</Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default connect(mapStateToProps, { deleteMessage, sendEditedMessage, sendMessage })(Message);
