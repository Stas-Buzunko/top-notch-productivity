import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import ActivityItem from './ActivityItem';
import firebase from 'firebase';
import { browserHistory } from 'react-router';

import './components.css';

class ActivityList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      price: '',
      isModalShown: false,
      chosenActivities: [],
      activityToEdit: '',
      isAllChosen: false
    }
  };

  componentWillReceiveProps(nextProps) {
    const { activities = [] } = this.props.user;
    const { chosenActivities } = this.state;
    const nextActivities = nextProps.user.activities || [];

    if (activities !== nextActivities) {
      const filtered = chosenActivities.filter(activity =>
        nextActivities.some(nextActivity => activity.id === nextActivity.id)
      )
      this.setState({chosenActivities: filtered})
    }
  }

  chooseAll() {
    const { isAllChosen } = this.state;
    const { activities = [] } = this.props.user;

    if (isAllChosen) {
      this.setState({chosenActivities: [], isAllChosen: !isAllChosen})
    } else {
      this.setState({chosenActivities: activities, isAllChosen: !isAllChosen})
    }
  }

  chooseActivity(activity) {
    const { chosenActivities } = this.state;
    const index = chosenActivities.indexOf(activity);
    let newChosen;

    if (index !== -1) {
      newChosen = [
        ...chosenActivities.slice(0, index),
        ...chosenActivities.slice(index + 1)
      ];
    } else {
      newChosen = [
        ...chosenActivities,
        activity
      ]
    }

    this.setState({chosenActivities: newChosen})
  }

  addActivity() {
    const { name, price, activityToEdit } = this.state;
    const { activities = [] } = this.props.user;
    const activity = {
      id: this.generateUUID(),
      name,
      price,
    };

    let newActivities;
    if (activityToEdit) {
      const index = activities.indexOf(activityToEdit);

      newActivities = [
        ...activities.slice(0, index),
        {...activityToEdit, name, price },
        ...activities.slice(index + 1)
      ]

    } else if (activities.length) {
      newActivities = [
        ...activities,
        activity
      ]
    } else {
      newActivities = [activity]
    }

    this.updateActivities(newActivities)
  }

  editActivity(activity) {
    this.setState({
      name: activity.name,
      price: activity.price,
      activityToEdit: activity,
      isModalShown: true
    })
  }

  deleteActivity(activity) {
    const { activities = [] } = this.props.user;
    const filtered = activities.filter(item => item.id !== activity.id);
    this.updateActivities(filtered);
  }

  updateActivities(newActivities) {
    const { user } = this.props;
    firebase.database().ref('users/' + user.uid + '/activities').set(newActivities)

    this.setState({
      name: '',
      price: '',
      isModalShown: false,
      activityToEdit: ''
    });
  }

  startNewDay() {
    const { chosenActivities } = this.state;
    const { dayId, user } = this.props;
    let newDay;

    if (dayId) {
      // update somehow
    } else {
      newDay = {
        startedAt: Date.now(),
        userId: user.uid,
        activities: chosenActivities
      }

      firebase.database().ref('days').push(newDay)
    }
  }

  isChosen(activity) {
    const { chosenActivities } = this.state;
    return chosenActivities.some(chosen =>
      chosen.id === activity.id)
  }

  generateUUID() {
    let d = Date.now();
    if(window.performance && typeof window.performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

  totalAmount() {
    const { chosenActivities } = this.state;
    let amount = 0;

    chosenActivities.forEach(activity => amount += Number(activity.price));

    return amount;
  }

  render () {
    const { isModalShown, isAllChosen, chosenActivities } = this.state;
    const { activities = [] } = this.props.user;
    const { isChoosable = true, isEditable = true, isDeletable = true, isAddable = true } = this.props;

    return (
      <div>
        <h3 className="block"> Add activity and its price</h3>
        <table className="table">
          <thead>
            <tr>
              {isChoosable && <td><input type='Checkbox' onChange={() => this.chooseAll()} checked={isAllChosen} /> Select all</td>}
              <th className="th-center">Activities</th>
              <th className="th-center">Price</th>
              {isEditable && <td>Edit</td>}
              {isDeletable && <td>Delete</td>}
            </tr>
          </thead>
          <tbody>
            {Boolean(activities.length) && activities.map((activity, i) => (
              <ActivityItem
                activity={activity}
                isChoosable={isChoosable}
                isChosen={this.isChosen(activity)}
                isEditable={isEditable}
                isDeletable={isDeletable}
                onDelete={() => this.deleteActivity(activity)}
                onEdit={() => this.editActivity(activity)}
                onSelect={() => this.chooseActivity(activity)}
                key={i} />
            ))}
          </tbody>
        </table>
        {isAddable && <button
          type="button block"
          className="btn btn-secondary btn-lg"
          onClick={() => this.setState({isModalShown: true})}>  +  </button>
        }
        {Boolean(activities.length) && !isChoosable &&
          <button
          type="button block"
          className="btn btn-secondary btn-lg"
          onClick={() => browserHistory.push('/')}
          style={{display: 'block', margin: 'auto'}}
          >  Return to main page  </button>
        }
        {Boolean(chosenActivities.length) && isChoosable &&
          <div>
            <h5>By continuing you agree that you could be charged up to ${this.totalAmount()}</h5>
            <h5> after 24 hours if you don't mark selected activities as done.</h5>
             <button
              type="button block"
              className="btn btn-secondary btn-lg"
              onClick={() => this.startNewDay()}
              style={{display: 'block', margin: 'auto'}}
              >  Just do it!  </button>
          </div>
        }
        <Modal
          backdrop={true}
          onHide={() => this.setState({isModalShown: false, price: '', name: ''})}
          show={isModalShown}>
          <Modal.Header>
            <Modal.Title>New activity</Modal.Title>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.setState({isModalShown: false, price: '', name: ''})}>
              <span aria-hidden="true">&times;</span>
            </button>
          </Modal.Header>

          <Modal.Body>
            <form>
              <div className="form-group">
                <label htmlFor="recipient-name" className="form-control-label">Activity:&nbsp;</label>
                <input className="date-input" onChange={e => this.setState({name: e.target.value})} value={this.state.name} />
              </div>
              <div className="form-group">
                <label htmlFor="message-text" className="form-control-label">Price: $</label>
                <input className="date-input" onChange={e => this.setState({price: e.target.value})} value={this.state.price} />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.setState({isModalShown: false, price: '', name: ''})}>Close</button>
            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.addActivity()}>Add Activity</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ActivityList;
