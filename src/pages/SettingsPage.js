import React, { Component } from 'react'
import firebase from 'firebase'
import { FormControl, Button } from 'react-bootstrap'
import toastr from 'toastr'

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      togglKey: '',
      workspace: '',
      email: '',
      user_ids: '',
      currentRate: '',
      preference: false
    }
  }

  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + userId + '/settings').once('value').then(snapshot => 
      this.setState({
        togglKey: snapshot.val().togglKey,
        workspace: snapshot.val().workspace,
        email: snapshot.val().email,
        user_ids: snapshot.val().user_ids,
        currentRate: snapshot.val().currentRate,
        preference: snapshot.val().preference
      })
    );
  }

  handleInputChange(field, value) {
    this.setState({
      [field]: value,
    })
  }

  numberChecker(value) {
    if (!isNaN(value)) {
      this.setState({
        currentRate: value,
      })
    }
  }

  handleSubmit = () => {
    const { togglKey, workspace, user_ids, currentRate, preference, email } = this.state
    if (togglKey.length && workspace.length && user_ids.length && currentRate.length && email.length) {
      this.setState({error: ''});
      this.settingsCustomer({togglKey, workspace, user_ids, email, currentRate, preference});
    } else {
      toastr.error('Please enter correct details');
    }
  }

  settingsCustomer(params) {
    const { togglKey, workspace, user_ids, email, currentRate, preference } = params
    const userUid = this.props.user.uid
    firebase.database().ref('users/' + userUid + '/settings').update({
      togglKey,
      workspace,
      email,
      currentRate,
      user_ids,
      preference
    }).then(() => toastr.success('Your settings info saved!'))
  }

  render() {
    const { togglKey, workspace, user_ids, email, currentRate, preference } = this.state;
    return (
      <div>
        <FormControl value={togglKey} type="text" placeholder="Toogl API key" onChange={e => this.handleInputChange('togglKey', e.target.value)} /><br />
        <FormControl value={workspace} type="text" placeholder="Workspace" onChange={e => this.handleInputChange('workspace', e.target.value)} /><br />
        <FormControl value={email} type="text" placeholder="Email" onChange={e => this.handleInputChange('email', e.target.value)} /><br />
        <FormControl value={user_ids} type="text" placeholder="User id" onChange={e => this.handleInputChange('user_ids', e.target.value)} /><br />
        <FormControl value={currentRate} type="text" placeholder="Current Rate" onChange={e => this.numberChecker(e.target.value)} /><br />
        <FormControl componentClass="select" value={preference} onChange={e => this.handleInputChange('preference', e.target.value === 'true')}>
          <option value={true}>24h</option>
          <option value={false}>till midnight</option>
        </FormControl><br />
        <Button onClick={this.handleSubmit}>Save settings</Button>
      </div>
    )
  }
}

export default Settings;
