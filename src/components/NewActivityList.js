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
      time: '',
      timeHub: '',
      timeWorkedBefore: '',
      timeWorkedBeforeHub: ''
    }
  }

  componentDidMount() {
    const { uid } = this.props.user
    firebase.database().ref('/users/' + uid + '/settings').once('value').then(snapshot => {
      const snapshotval = snapshot.val()
      const { preference, workspace, togglKey, email, user_ids, currentRate, hubstaffAuthToken, hubstaffAppToken } = snapshot.val()
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
          user_ids,
          hubstaffAuthToken,
          hubstaffAppToken
        })
      }
    })

    firebase.database().ref('/users/' + uid + '/challenge').once('value').then(snapshot => {
      const snapshotval = snapshot.val()
      const { hours, money, how_long, timeWorkedBefore, timeWorkedBeforeHub, startedAt } = snapshot.val()
      if (snapshotval !== null) {
        if (how_long) {
          if (startedAt + 86400000 > moment()) {
            this.setState({
              hours,
              money,
              how_long,
              timeWorkedBefore,
              startedAt,
              timeWorkedBeforeHub,
              isModalShown: false
            })
            this.toggl()
            this.hubstaff()
          }
        } else {
          if (startedAt + 86400000 - (startedAt % 86400000) > moment()) {
            this.setState({
              hours,
              money,
              how_long,
              timeWorkedBefore,
              startedAt,
              timeWorkedBeforeHub,
              isModalShown: false
            })
            this.toggl()
            this.hubstaff()
          }
        }
      }
    })
  }

  hubstaff() {
    if (this.state.hubstaffAuthToken) {
      const time = moment(this.state.startedAt).format('YYYY-MM-DD')

      axios({
        url: 'https://api.hubstaff.com/v1/custom/by_date/my',
        headers: {
          'Auth-Token': this.state.hubstaffAuthToken,
          'App-Token': this.state.hubstaffAppToken
        },
        params: {
          start_date: time,
          end_date: moment().format('YYYY-MM-DD')
        }
      })
      .then(response => {
        const time = response.data.organizations.reduce((sum, current) => {return (sum + current.duration)}, 0)
        this.setState({timeHub: time})
      })
      .catch(error => console.log(error))
    }
  }

  toggl() {
    if (this.state.togglKey && this.state.email && this.state.workspace && this.state.user_ids) {
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

    if (this.state.togglKey && this.state.email && this.state.workspace && this.state.user_ids && this.state.hubstaffAuthToken) {
      const toggl = axios({
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

      const hubstaff = axios({
        url: 'https://api.hubstaff.com/v1/custom/by_date/my',
        headers: {
          'Auth-Token': this.state.hubstaffAuthToken,
          'App-Token': this.state.hubstaffAppToken
        },
        params: {
          start_date: time,
          end_date: time
        }
      })
      Promise.all([ toggl, hubstaff ])
      .then((response) => {
        const timeWorkedBefore = response[0].data.total_grand
        const timeWorkedBeforeHub = response[1].data.organizations.reduce((sum, current) => {return (sum + current.duration)}, 0)
        this.setState({ timeWorkedBefore, timeWorkedBeforeHub })

        const { hours, money, how_long } = this.state
        if ((hours.length > 0) && (money > 0)) {
          this.challengeSave({hours, money, how_long, timeWorkedBefore, timeWorkedBeforeHub})
        } else {
          toastr.error('Please enter correct details')
        }
      })
      .catch((error) => {console.log(error)})
    } else if (this.state.hubstaffAuthToken) {
      axios({
        url: 'https://api.hubstaff.com/v1/custom/by_date/my',
        headers: {
          'Auth-Token': this.state.hubstaffAuthToken,
          'App-Token': this.state.hubstaffAppToken
        },
        params: {
          start_date: time,
          end_date: time
        }
      })
      .then((response) => {
        const timeWorkedBeforeHub = response.data.organizations.reduce((sum, current) => {return (sum + current.duration)}, 0)
        this.setState({ timeWorkedBeforeHub })

        const { hours, money, how_long } = this.state
        if ((hours.length > 0) && (money > 0)) {
          this.challengeSave({hours, money, how_long, timeWorkedBeforeHub})
        } else {
          toastr.error('Please enter correct details')
        }
      })
      .catch((error) => {console.log(error)})
    } else if (this.state.togglKey && this.state.email && this.state.workspace && this.state.user_ids) {
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


  }

  challengeSave(params) {
    let { hours, money, how_long, timeWorkedBefore, timeWorkedBeforeHub } = params
    const { uid } = this.props.user
    const key = firebase.database().ref('days').push().key
    const startedAt = Date.now()
    if (!timeWorkedBeforeHub) {
      timeWorkedBeforeHub = ''
    }
    if (!timeWorkedBefore) {
      timeWorkedBefore = ''
    }
    firebase.database().ref('days/' + key).update({
      hours,
      money,
      how_long,
      uid,
      timeWorkedBefore,
      timeWorkedBeforeHub,
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
        timeWorkedBeforeHub,
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
                <th>Tracked in Toggl:</th>
                <th>Tracked in hubstaff:</th>
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
                {this.state.timeHub ? (
                  <td><h5>{(this.state.timeHub - this.state.timeWorkedBeforeHub) / 3600}</h5></td>
                ) : (<td><h5></h5></td>)}
                {(this.state.time && this.state.timeHub) ? (
                  <td><h5>{(this.state.time - this.state.timeWorkedBefore) / 3600000 + (this.state.timeHub - this.state.timeWorkedBeforeHub) / 3600}</h5></td>
                ) : (this.state.time) ? (<td><h5>{(this.state.time - this.state.timeWorkedBefore) / 3600000}</h5></td>
                ) : (this.state.timeHub) ? (<td><h5>{(this.state.timeHub - this.state.timeWorkedBeforeHub) / 3600}</h5></td>
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
