import React, { Component } from 'react';
import { debounce } from 'lodash-es';
import * as EmailValidator from 'email-validator';
import AsyncSelect from 'react-select/async';
import { connect } from 'react-redux';
import { joinDirectSpace, setInvitee, setInvitees } from '../redux/actions/spaceActions';

export class DMSearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      convertedList: [
        {
          value: '',
          label: ''
        }
      ]
    };

    const func = async (input) => {
      await window.SampleAvayaSpacesSDK.getColleaguesAndDMList(input)
        .then((colleaguesAndDMList) => {
          console.log('getColleaguesAndDMList');
          const result = Object.keys(colleaguesAndDMList).map((idx) => ({
            value: colleaguesAndDMList[idx],
            label: `${colleaguesAndDMList[idx].displayname} <${colleaguesAndDMList[idx].username}>`,
            inviteeType: 'userId'
          }));

          return result;
        })
        .then((res) => {
          this.setState({ convertedList: res }, () => this.state.convertedList);
        });
    };

    const dbnc = debounce((input) => {
      func(input).then((res) => {
        console.log(res);
      });
    }, 150);

    const inputDebouncer = async (inp) => {
      console.log(inp);
      Promise.resolve(dbnc(inp)).then((res) => console.log(res));
      await Promise.resolve(dbnc(inp));

      return this.state.convertedList;
    };

    this.getAsyncOptions = async (input) => {
      console.log(input);
      // 1. Check if it's an email value, if true, return an option value with added "inviteeType": 'email'
      if (EmailValidator.validate(input)) {
        return [
          {
            value: input,
            label: `✉️ ${input}`,
            inviteeType: 'email'
          }
        ];
      }
      // 2. If not an email value, debounce 1 sec and then look among colleagues and DM

      const p = await inputDebouncer(input);

      return p;
    };

    this.handleContactClick = (contact) => {
      switch (this.props.contactClickAction) {
        case 'joinDirectSpace':
          contact?.value?._id && this.props.joinDirectSpace(contact?.value?._id);
          break;
        case 'addToInviteeList':
          if (contact === null) return;
          this.props.setInvitees(contact);
          break;
        default:
          this.props.setInvitees([]);
          break;
      }
    };
  }

  render() {
    return (
      <div>
        <AsyncSelect
          loadOptions={(inputValue) => this.getAsyncOptions(inputValue)}
          onChange={(opt) => this.handleContactClick(opt)}
          placeholder="Enter name or email address"
          isClearable="true"
          defaultOptions={this.state.convertedList}
        />
      </div>
    );
  }
}

export default connect(null, { joinDirectSpace, setInvitees, setInvitee })(DMSearchBar);
