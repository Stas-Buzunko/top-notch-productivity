import React, { Component } from 'react'
import { Table, Button, Modal, ControlLabel, FormControl } from 'react-bootstrap'
import './components.css'
import firebase from 'firebase'
import toastr from 'toastr'
import moment from 'moment'
import CountDown from './CountDown'
import axios from 'axios'

class NewActivityList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hours: '',
      money: '',
      how_long: true,
      startedAt: '',
      isModalShown: true,
      workspace: '',
      togglKey: '',
      email: '',
      user_ids: '',
      time: ''
    }
  }

  componentDidMount() {
    const { uid } = this.props.user
    firebase.database().ref('/users/' + uid + '/settings').once('value').then(snapshot => {
      const snapshotval = snapshot.val()
      const { preference, workspace, togglKey, email, user_ids, currentRate } = snapshot.val()
      if (snapshotval !== null) {
        if (currentRate) {
          this.setState({
            money: currentRate * 0.4
          })
        }
        this.setState({
          how_long: preference,
          workspace,
          togglKey,
          email,
          user_ids
        })
      }
    })

    firebase.database().ref('/users/' + uid + '/challenge').once('value').then(snapshot => {
      const snapshotval = snapshot.val()
      const { hours, money, how_long, timeWorkedBefore, startedAt } = snapshot.val()
      if (snapshotval !== null) {
        if (snapshot.val().startedAt + 86400000 > moment()) {
          this.setState({
            hours,
            money,
            how_long,
            timeWorkedBefore,
            startedAt,
            isModalShown: false
          })
          this.toggle()    
        }
      }
    })
  }

  toggle() {
    const authStr = 'Basic ' + window.btoa(this.state.togglKey + ':api_token')
    const time = moment(this.state.startedAt).format('YYYY-MM-DD')
    axios({
      headers: {
        Authorization: authStr
      },
      url: 'https://toggl.com/reports/api/v2/details',
      params: {
        user_agent: this.state.email,
        workspace_id: this.state.workspace,
        user_ids: this.state.user_ids,
        since: time
      }
    })
    .then(response => this.setState({ time: response.data.total_grand }))
    .catch(error => console.log(error))
  }

  numberChecker(field, value) {
    if (!isNaN(value)) {
      this.setState({
        [field]: value,
      })
    }
  }

  addChallenge = () => {
    const authStr = 'Basic ' + window.btoa(this.state.togglKey + ':api_token')
    const time = moment().format('YYYY-MM-DD')
    axios({
      headers: {
        Authorization: authStr
      },
      url: 'https://toggl.com/reports/api/v2/details',
      params: {
        user_agent: this.state.email,
        workspace_id: this.state.workspace,
        user_ids: this.state.user_ids,
        since: time
      }
    })
    .then((response) => {
      console.log(response)
      const timeWorkedBefore = response.data.total_grand
      this.setState({ timeWorkedBefore })

      const { hours, money, how_long } = this.state
      if ((hours.length > 0) && (money > 0)) {
        this.challengeSave({hours, money, how_long, timeWorkedBefore})
      } else {
        toastr.error('Please enter correct details')
      }
    })
    .catch((error) => {console.log(error)})
  }

  challengeSave(params) {
    const { hours, money, how_long, timeWorkedBefore } = params
    const { uid } = this.props.user
    const key = firebase.database().ref('days').push().key
    const startedAt = Date.now()
    firebase.database().ref('days/' + key).update({
      hours,
      money,
      how_long,
      uid,
      timeWorkedBefore,
      startedAt,
      isDayOver: false,
      isCharged: false
    })
    .then(() => toastr.success('Your Activity saved!'))
    .then(
      firebase.database().ref('users/' + uid + '/challenge').set({
        hours,
        money,
        how_long,
        uid,
        timeWorkedBefore,
        startedAt,
        isDayOver: false,
        isCharged: false,
        key: key
      })
    )
    this.setState({
      isModalShown: false,
      startedAt: Date.now()
    })
  }

  render () {
    return (
      <div>
        {this.state.startedAt ? (
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Number of hours:</th>
                <th>Amount of money:</th>
                <th>Will be over:</th>
                <th>How much time you worked:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><h5>{this.state.hours}</h5></td>
                <td><h5>{this.state.money}</h5></td>
                <td><CountDown how_long={this.state.how_long} hours={this.state.hours} startedAt={this.state.startedAt}/></td>
                {this.state.time ? (
                  <td><h5>{(this.state.time - this.state.timeWorkedBefore) / 3600000}</h5></td>
                ) : (<td><h5></h5></td>)}
              </tr>
            </tbody>
          </Table>
        ) : (<Button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.setState({isModalShown: true})}>Open Challenge</Button>)}
        <Modal
          backdrop={true}
          onHide={() => this.setState({isModalShown: false, hours: ''})}
          show={this.state.isModalShown}>
          <Modal.Header>
            <Modal.Title>New challenge</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <ControlLabel htmlFor="recipient-name" className="form-control-label">Number of hours:</ControlLabel>
                <FormControl className="date-input" onChange={e => this.numberChecker('hours', e.target.value)} value={this.state.hours} />
              </div>
              <div className="form-group">
                <ControlLabel htmlFor="message-text" className="form-control-label">Amount of money: $</ControlLabel>
                <FormControl className="date-input" onChange={e => this.numberChecker('money', e.target.value)} value={this.state.money} />
              </div>
              <div className="form-group">
                <ControlLabel htmlFor="message-text" className="form-control-label">For how long:</ControlLabel>
                <FormControl componentClass="select" onChange={e => this.setState({how_long: e.target.value === 'true'})} value={this.state.how_long}>
                  <option value={true}>24h</option>
                  <option value={false}>till midnight</option>
                </FormControl>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.setState({isModalShown: false})}>Close</button>
            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.addChallenge()}>Add Challenge</button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default NewActivityList
