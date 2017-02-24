import React, { Component } from 'react';
import {  browserHistory } from 'react-router';
import './components.css';

class AddActivity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activities: [],
      name: '',
      price: '',
    }
  };

  pushToStartNewDay() {
    browserHistory.push('startNewDay')
  };

  saveActivity() {
    const { activities, name, price } = this.state;
    const activityNum = activities.length;
    const activity = {
      id : activityNum,
      name,
      price,
    };

    this.setState({
      activities: [
        ...activities,
        activity
      ],
      name: '',
      price: '',
    });
  }

  render () {
    return (
      <div className="container">
        <div className="outer">
          <span className="inner">
            <h3 className="block"> Add activity and its price</h3>
            <table className="table">
              <thead>
                <tr>
                  <th className="th-center">Activities</th>
                  <th className="th-center">Price</th>
                </tr>
              </thead>
              <tbody>
                {!!this.state.activities.length && this.state.activities.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td >{item.name}</td>
                      <td >{item.price}</td>
                    </tr>
                  )}
                )}
              </tbody>
            </table>
            <ol className="noMarker" >
              <li className="block">
                <button type="button block" className="btn btn-secondary btn-lg" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo">  +  </button>
                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">New activity</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.setState({price: '', name: ''})}>
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
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
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.setState({price: '', name: ''})}>Close</button>
                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.saveActivity()}>Save Activity</button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="block">
                <button type="button block" className="btn btn-secondary btn-lg" onClick={() => this.pushToStartNewDay()}>  Next  </button>
              </li>
            </ol>
          </span>
        </div>
      </div>
    );
  }
}

export default AddActivity;
