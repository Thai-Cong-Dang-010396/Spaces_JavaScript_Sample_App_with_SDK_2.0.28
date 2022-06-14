import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Message from '../components/Message';
import UserTyping from '../components/UserTyping';
import Post from '../components/Post';
import Task from '../components/Task';
import Meeting from '../components/Meeting';
import LiveMeeting from '../components/LiveMeeting';
import { toUTCDate } from '../utils';
import TextEditor from '../components/TextEditor';
import { setUploadedFile, uploadChatFile } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  partyTyping: state.data.partyTyping,
  spaceContent: state.data.spaceContent,
  meetingData: state.data.meetingData,
  uploadedFile: state.data.uploadedFile,
  attachmentFeatureDenied: state.data.attachmentFeatureDenied
});

function Chat(props) {
  const { uploadedFile, attachmentFeatureDenied } = props;

  const handleDrop = (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    const fileArray = [...files];

    props.setUploadedFile(...fileArray);
  };

  const initFileDragDrop = () => {
    const chatContainer = document.querySelector('.chat-container');

    const active = () => chatContainer.classList.add('green-border');

    const inactive = () => chatContainer.classList.remove('green-border');

    const prevents = (e) => e.preventDefault();

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((evtName) => {
      chatContainer.addEventListener(evtName, prevents);
    });

    ['dragenter', 'dragover'].forEach((evtName) => {
      chatContainer.addEventListener(evtName, active);
    });

    ['dragleave', 'drop'].forEach((evtName) => {
      chatContainer.addEventListener(evtName, inactive);
    });

    chatContainer.addEventListener('drop', handleDrop);
  };

  const contentRef = useRef();
  const { spaceContent, partyTyping, meetingData } = props;
  const liveMeetingOngoing = meetingData?.content?.endTime === null;

  useEffect(() => {
    contentRef.current.scrollTop =
      contentRef.current.scrollHeight - contentRef.current.clientHeight;
  }, [spaceContent, partyTyping, meetingData, uploadedFile]);

  useEffect(() => {
    attachmentFeatureDenied === false && initFileDragDrop();
  }, [attachmentFeatureDenied]);

  useEffect(() => {
    console.log(uploadedFile);
  }, [uploadedFile]);

  return (
    <div className="chat-container">
      <div className="log" ref={contentRef}>
        {spaceContent.map((item, idx) => {
          if (item.category === 'chat')
            return (
              <Message
                message={item}
                messageTxt={item.content.bodyText}
                avatarURL={item.sender.picture_url}
                createdOn={toUTCDate(item.created)}
                key={idx}
                sender={item.sender._id}
                data={item.content.data}
              />
            );
          if (item.category === 'meeting') return <Meeting item={item} key={idx} />;
          if (item.category === 'idea') return <Post post={item} key={idx} />;
          if (item.category === 'task') return <Task task={item} key={idx} />;
          return null;
        })}
        {liveMeetingOngoing && <LiveMeeting />}
        {partyTyping && <UserTyping />}
      </div>
      {uploadedFile[0]?.name ? (
        <span className="text-left">
          {uploadedFile[0].name}
          <Button onClick={() => props.uploadChatFile(uploadedFile)}>Upload</Button>
          <Button onClick={() => props.setUploadedFile([])} variant="danger">
            Remove
          </Button>
        </span>
      ) : null}
      <TextEditor />
    </div>
  );
}

export default connect(mapStateToProps, { setUploadedFile, uploadChatFile })(Chat);
