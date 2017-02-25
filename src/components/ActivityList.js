import React, { Component } from 'react';
import { Modal } from 'react-bootstrap'
import ActivityItem from './ActivityItem';
import firebase from 'firebase'
import './components.css';

class ActivityList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      price: '',
      isModalShown: false,
      chosenActivities: [],
      activityToEdit: ''
    }
  };

  chooseAll() {
    const { chosenActivities } = this.state;
    const { activities = [] } = this.props.user;

    if (chosenActivities.length === activities.length) {
      this.setState({chosenActivities: []})
    } else {
      this.setState({chosenActivities: activities})
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
      name,
      price,
    };

    let newActivities;
    if (activityToEdit) {
      const index = activities.indexOf(activityToEdit);

      newActivities = [
        ...activities.slice(0, index),
        activity,
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

    const index = activities.indexOf(activity);

    if (index !== -1) {
      const newActivities = [
        ...activities.slice(0, index),
        ...activities.slice(index + 1)
      ];

      this.updateActivities(newActivities);
    }
  }

  updateActivities(newActivities) {
    console.log(newActivities)
    const { user } = this.props;
    firebase.database().ref('users/' + user.uid + '/activities').set(newActivities)

    this.setState({
      name: '',
      price: '',
      isModalShown: false,
      activityToEdit: ''
    });
  }

  render () {
    const { isModalShown, chosenActivities } = this.state;
    const { activities = [] } = this.props.user;
    const { isChoosable = true, isEditable = true, isDeletable = true, isAddable = true } = this.props;

    return (
      <div>
        <h3 className="block"> Add activity and its price</h3>
        <table className="table">
          <thead>
            <tr>
              {isChoosable && <td><input type='Checkbox' onChange={() => this.chooseAll()} /> Select all</td>}
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
                isChosen={chosenActivities.indexOf(activity) !== -1}
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
                <label htmlFor="recipient-name" className="form-control-label">Activity:</label>
                <input className="date-input" onChange={e => this.setState({name: e.target.value})} value={this.state.name} />
              </div>
              <div className="form-group">
                <label htmlFor="message-text" className="form-control-label">Price:</label>
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
