import React, { Component } from 'react'
import firebase from 'firebase'
import { FormControl, Button, ControlLabel, Modal } from 'react-bootstrap'
import toastr from 'toastr'
import axios from 'axios'
import moment from 'moment'

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      togglKey: '',
      workspace: '',
      email: '',
      user_ids: '',
      currentRate: '',
      preference: false,
      hubstaffEmail: '',
      hubstaffPass: '',
      hubstaffAppToken: '2_kp4QCNIFhHrqlPjDOPGSPAf2JManDV3ldYi4MyVXo',
      hubstaffAuthToken: '',
      isModalShown: false
    }
  }

  componentDidMount() {
    const { uid } = this.props.user
    firebase.database().ref('/users/' + uid + '/settings').once('value').then(snapshot => {
      const snapshotval = snapshot.val()
      const { togglKey, workspace, email, user_ids, currentRate, preference, hubstaffAuthToken } = snapshot.val()
      if (snapshotval !== null) {
        this.setState({
          togglKey,
          workspace,
          email,
          user_ids,
          currentRate,
          preference,
          hubstaffAuthToken
        })
      }
    });
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

  generateToken() {
    const { hubstaffAppToken, hubstaffEmail, hubstaffPass} = this.state
    axios({
      method: 'post',
      url: 'https://api.hubstaff.com/v1/auth',
      headers: {
        'App-Token': hubstaffAppToken
      },
      data: {
        email: hubstaffEmail,
        password: hubstaffPass
      }
    })
    .then((res) => {
      this.setState({hubstaffAuthToken: res.data.user.auth_token, isModalShown: false})
      toastr.success('Token created!')
    })
    .catch((err) => console.log(err))    
  }

  handleSettSubmit = () => {
    const { preference, currentRate } = this.state
    if (currentRate.length) {
      this.setState({error: ''});
      this.settingsSettCustomer({currentRate, preference});
    } else {
      toastr.error('Please enter correct details');
    }
  }
  settingsSettCustomer(params) {
    const { preference, currentRate } = params
    const userUid = this.props.user.uid
    firebase.database().ref('users/' + userUid + '/settings').update({
      currentRate,
      preference
    })
    .then(() => toastr.success('Your settings info saved!'))
  }

  handleHubSubmit = () => {
    const { hubstaffAppToken, hubstaffAuthToken } = this.state
    if (hubstaffAppToken.length && hubstaffAuthToken.length) {
      this.setState({error: ''});
      this.settingsHubCustomer({hubstaffAppToken, hubstaffAuthToken});
    } else {
      toastr.error('Please enter correct details');
    }
  }
  settingsHubCustomer(params) {
    const { hubstaffAppToken, hubstaffAuthToken } = params
    const userUid = this.props.user.uid

    firebase.database().ref('users/' + userUid + '/settings').update({
      hubstaffAuthToken,
      hubstaffAppToken
    })
    .then(() => toastr.success('Your settings info saved!'))
  }

  handleSubmit = () => {
    const { togglKey, workspace, user_ids, email } = this.state
    if (togglKey.length && workspace.length && user_ids.length && email.length) {
      this.setState({error: ''});
      this.settingsCustomer({togglKey, workspace, user_ids, email});
    } else {
      toastr.error('Please enter correct details');
    }
  }
  settingsCustomer(params) {
    const { togglKey, workspace, user_ids, email } = params
    const userUid = this.props.user.uid
    firebase.database().ref('users/' + userUid + '/settings').update({
      togglKey,
      workspace,
      email,
      user_ids
    })
    .then(() => toastr.success('Your settings info saved!'))
  }

  render() {
    const {
      togglKey,
      workspace,
      user_ids,
      email,
      currentRate,
      preference,
      hubstaffEmail,
      hubstaffPass,
      hubstaffAppToken,
      hubstaffAuthToken
    } = this.state;
    return (
      <div>
        <Modal
          backdrop={true}
          onHide={() => this.setState({isModalShown: false})}
          show={this.state.isModalShown}>
          <Modal.Header>
            <Modal.Title>Generate token</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <ControlLabel htmlFor="recipient-name" className="form-control-label">Hubstaff Email:</ControlLabel>
                <FormControl className="date-input" onChange={e => this.handleInputChange('hubstaffEmail', e.target.value)} value={this.state.hubstaffEmail} />
              </div>
              <div className="form-group">
                <ControlLabel htmlFor="message-text" className="form-control-label">Hubstaff Password:</ControlLabel>
                <FormControl className="date-input" type="password" onChange={e => this.handleInputChange('hubstaffPass', e.target.value)} value={this.state.hubstaffPass} />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.setState({isModalShown: false})}>Close</button>
            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.generateToken()}>Generate Auth token</button>
          </Modal.Footer>
        </Modal>
        <div className="row">
          <div className="col-md-4">
            <ControlLabel>Toggl key:</ControlLabel>
            <FormControl value={togglKey} type="text" placeholder="Toogl API key" onChange={e => this.handleInputChange('togglKey', e.target.value)} /><br />
            <ControlLabel>Toggl workspace:</ControlLabel>
            <FormControl value={workspace} type="text" placeholder="Workspace" onChange={e => this.handleInputChange('workspace', e.target.value)} /><br />
            <ControlLabel>Toggle email:</ControlLabel>
            <FormControl value={email} type="text" placeholder="Email" onChange={e => this.handleInputChange('email', e.target.value)} /><br />
            <ControlLabel>Toggle user Id:</ControlLabel>
            <FormControl value={user_ids} type="text" placeholder="User id" onChange={e => this.handleInputChange('user_ids', e.target.value)} /><br />
            <Button onClick={this.handleSubmit}>Save Toggl settings</Button>
          </div>
          <div className="col-md-4">
            <Button onClick={() => this.setState({isModalShown: true})}>Generate auth token</Button>
            <ControlLabel>Hubstaff Auth Token:</ControlLabel>
            <FormControl value={hubstaffAuthToken} type="text" placeholder="Hubstaff Auth Token" onChange={e => this.handleInputChange('hubstaffAuthToken', e.target.value)} /><br />
            <Button onClick={this.handleHubSubmit}>Save Hubstaff settings</Button>
          </div>
          <div className="col-md-4">
            <ControlLabel>Current Rate:</ControlLabel>
            <FormControl value={currentRate} type="text" placeholder="Current Rate" onChange={e => this.numberChecker(e.target.value)} /><br />
            <ControlLabel>Time to challenge:</ControlLabel>
            <FormControl componentClass="select" value={preference} onChange={e => this.handleInputChange('preference', e.target.value === 'true')}>
              <option value={true}>24h</option>
              <option value={false}>till midnight</option>
            </FormControl><br />
            <Button onClick={this.handleSettSubmit}>Save settings</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default Settings;
