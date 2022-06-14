import React, { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'quill-mention';
import { connect } from 'react-redux';
import { sendMessage } from '../redux/actions/spaceActions';
import mentionItemList from '../modules/mention/mentionItemList';
import MentionBlot from '../modules/mention/mentionBlot';

const mapStateToProps = (state) => ({
  spaceMembers: state.data.spaceMembers,
  uploadedFile: state.data.uploadedFile
});

Quill.register(MentionBlot, true);

export class TextEditor extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { message: '' };
    this.atValues = [{}];

    this.modules = {
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        mentionDenotationChars: ['@'],
        positioningStrategy: 'fixed',
        spaceAfterInsert: true,
        isolateCharacter: true,
        defaultMenuOrientation: 'top',
        source: (searchTerm, renderList) => {
          if (searchTerm.length === 0) {
            renderList(this.atValues, searchTerm);
          } else {
            const matches = [];

            for (let i = 0; i < this.atValues.length; i++)
              if (~this.atValues[i].value.toLowerCase().indexOf(searchTerm.toLowerCase()))
                matches.push(this.atValues[i]);
            renderList(matches, searchTerm);
          }
        },
        renderItem: (item) => mentionItemList(item, this.props.noMentionMatches),
        onSelect: (item, insertItem) => {
          if (item && item.id) {
            insertItem(item);
          }
        }
      }
    };
  }

  componentDidUpdate(prevProps) {
    const membersChanged = prevProps.spaceMembers !== this.props.spaceMembers;

    if (membersChanged) {
      this.atValues = Object.keys(this.props.spaceMembers).map((key) => ({
        id: key,
        value: this.props.spaceMembers[key].displayname,
        username: this.props.spaceMembers[key].username,
        avatar: this.props.spaceMembers[key].picture_url
      }));
    }
  }

  render() {
    const { message } = this.state;
    const { uploadedFile } = this.props;

    return (
      <div className="row m-0">
        <form
          className="chat-input-area col-10 m-0 p-0"
          id="quillForm"
          onSubmit={(e) =>
            message.length
              ? (this.props.sendMessage({ message, data: uploadedFile }),
                this.setState({ message: '' }),
                e.preventDefault())
              : null
          }
        >
          <ReactQuill
            onChange={(e) => this.setState({ message: e })}
            value={message}
            defaultValue=""
            modules={this.modules}
            placeholder="Enter a message or drag and drop a file"
          />
        </form>
        {message.length ? (
          <div className="col-2">
            <button
              className="btn btn-primary btn-block p-1 m-0"
              type="button"
              onClick={(e) => {
                this.props.sendMessage({ message, data: uploadedFile });
                this.setState({ message: '' });
                e.preventDefault();
              }}
            >
              Send
            </button>
          </div>
        ) : (
          <div className="col-2">
            <button className="btn btn-primary btn-block p-1 m-0" type="button" disabled>
              Send
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, { sendMessage })(TextEditor);
