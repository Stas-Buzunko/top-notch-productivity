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
    const { togglKey, workspace, currentRate, preference } = this.state
    if (togglKey.length && workspace.length && currentRate.length) {
      this.setState({error: ''});
      this.settingsCustomer({togglKey, workspace, currentRate, preference});
    } else {
      this.setState({error: 'Please enter correct details'});
      toastr.error('Please enter correct details');
    }
  }

  settingsCustomer(params) {
    const { togglKey, workspace, currentRate, preference } = params
    const userUid = this.props.user.uid
    firebase.database().ref('users/' + userUid + '/settings').update({
      togglKey,
      workspace,
      currentRate,
      preference
    }).then(() => toastr.success('Your settings info saved!'))
  }

  render() {
    const { togglKey, workspace, currentRate, preference } = this.state;
    return (
      <div>
        <FormControl value={togglKey} type="text" placeholder="Toogl API key" onChange={e => this.handleInputChange('togglKey', e.target.value)} /><br />
        <FormControl value={workspace} type="text" placeholder="Workspace" onChange={e => this.handleInputChange('workspace', e.target.value)} /><br />
        <FormControl value={currentRate} type="text" placeholder="Current Rate" onChange={e => this.numberChecker(e.target.value)} /><br />
        <FormControl componentClass="select" value={preference} onChange={e => this.handleInputChange('preference', e.target.value)}>
          <option value={true}>24h</option>
          <option value={false}>till midnight</option>
        </FormControl><br />
        <Button onClick={this.handleSubmit}>Save settings</Button>
      </div>
    )
  }
}

export default Settings;
