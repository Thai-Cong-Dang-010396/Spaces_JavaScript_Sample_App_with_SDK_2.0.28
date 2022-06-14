import React, { useState, useEffect } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import { Tab, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Chat from './Chat';
import Posts from './Posts';
import Tasks from './Tasks';
import Meetings from './Meetings';
import {
  getSpacePosts,
  getSpaceTasks,
  getSpaceMeetings,
  toggleModalSpaceSettings,
  toggleModalSpaceInvite
} from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  spaceTitle: state.data.spaceTitle,
  showSpaceSettingsModal: state.data.showSpaceSettingsModal,
  showModalSpaceInvite: state.data.showModalSpaceInvite
});

function SpaceContent(props) {
  const [eventKey, setEventKey] = useState('chatContainer');
  const { showSpaceSettingsModal } = props;

  useEffect(() => {
    if (props.spaceTitle) {
      if (eventKey === 'postsContainer') {
        props.getSpacePosts();
      }
      if (eventKey === 'tasksContainer') {
        props.getSpaceTasks();
      }
      if (eventKey === 'meetingsContainer') {
        props.getSpaceMeetings();
      }
    }
  }, [eventKey, props]);

  return (
    <div>
      <h3>
        Joined space: {props.spaceTitle}
        {props.spaceTitle && (
          <>
            <Button onClick={() => props.toggleModalSpaceSettings(!showSpaceSettingsModal)}>
              ⚙️Settings
            </Button>
            <Button onClick={() => props.toggleModalSpaceInvite(true)}>➕Invite People</Button>
          </>
        )}
      </h3>
      <Tabs
        defaultActiveKey="chatContainer"
        transition={false}
        onSelect={function (k) {
          setEventKey(k);
        }}
      >
        <Tab eventKey="chatContainer" title="Chat">
          <Chat />
        </Tab>
        <Tab eventKey="postsContainer" title="Posts">
          <Posts />
        </Tab>
        <Tab eventKey="tasksContainer" title="Tasks">
          <Tasks />
        </Tab>
        <Tab eventKey="meetingsContainer" title="Meetings">
          <Meetings />
        </Tab>
      </Tabs>
    </div>
  );
}

export default connect(mapStateToProps, {
  getSpacePosts,
  getSpaceTasks,
  getSpaceMeetings,
  toggleModalSpaceSettings,
  toggleModalSpaceInvite
})(SpaceContent);
