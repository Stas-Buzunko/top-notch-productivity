import React, { Component } from 'react'
import { Table, Button, Modal, ControlLabel, FormControl } from 'react-bootstrap'
import './components.css'
import firebase from 'firebase'
import toastr from 'toastr'
import moment from 'moment'
import CountDown from './CountDown'

class NewActivityList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hours: '',
      money: '',
      how_long: true,
      startedAt: '',
      isModalShown: true
    }
  }

  componentDidMount() {
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + userId + '/settings').once('value').then(snapshot => {
      const currentRate = (snapshot.val().currentRate * 0.4)
      this.setState({
        money: currentRate
      })
    })
    firebase.database().ref('/users/' + userId + '/challenge').once('value').then(snapshot => {
      if (snapshot.val().startedAt + 86400000 > moment()) {
        this.setState({
          hours: snapshot.val().hours,
          money: snapshot.val().money,
          how_long: snapshot.val().how_long,
          startedAt: snapshot.val().startedAt,
          isModalShown: false
        })    
      }
    })
  }

  numberChecker(field, value) {
    if (!isNaN(value)) {
      this.setState({
        [field]: value,
      })
    }
  }

  addChallenge = () => {
    const { hours, money, how_long } = this.state
    if ((hours.length > 0) && (money > 0)) {
      this.setState({error: ''});
      this.challengeSave({hours, money, how_long});
    } else {
      toastr.error('Please enter correct details');
    }
  }

  challengeSave(params) {
    const { hours, money, how_long } = params
    const userUid = this.props.user.uid
    const key = firebase.database().ref('days').push().key
    firebase.database().ref('days/' + key).update({
      hours,
      money,
      how_long,
      userUid,
      startedAt: Date.now(),
      isDayOver: false,
      isCharged: false
    }).then(() => toastr.success('Your Activity saved!'))
    firebase.database().ref('users/' + userUid + '/challenge').set({
      hours,
      money,
      how_long,
      userUid,
      startedAt: Date.now(),
      isDayOver: false,
      isCharged: false,
      key: key
    })
    this.setState({
      isModalShown: false,
      startedAt: Date.now()
    })
  }

  render () {
    return (
      <div>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Number of hours:</th>
              <th>Amount of money:</th>
              <th>Will be over:</th>
            </tr>
          </thead>
          <tbody>
            {this.state.startedAt ? (
              <tr>
                  <td><h5>{this.state.hours}</h5></td>
                  <td><h5>{this.state.money}</h5></td>
                  <td><CountDown how_long={this.state.how_long} hours={this.state.hours} startedAt={this.state.startedAt}/></td>
              </tr>
            ) : (<tr><td></td><td></td><td></td></tr>)}
          </tbody>
        </Table>
        <Modal
          backdrop={true}
          onHide={() => this.setState({isModalShown: false, hours: '', money: ''})}
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
    );
  }
}

export default NewActivityList;
