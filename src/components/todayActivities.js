import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import './components.css';

class TodayActivities extends Component {
  constructor(props) {
   super(props);

   this.state = {
     activity: '',
   };
};
  pushToChooseTodayActivities() {
    browserHistory.push('chooseTodayActivities')
  }
  render () {
    const {activity } = this.state;
    return (
      <div className="outer">
        <span className="inner">
          <h3 className="block"> Activities for today</h3>
          <div className="input-group">
            <span className="input-group-addon" id="basic-addon1">+</span>
            <input value={activity} type="text" className="form-control" placeholder="Add" aria-describedby="basic-addon1"  onChange={e => this.setState({activity: e.target.value})}/>
          </div>


          <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner" role="listbox">
              <div className="carousel-item active">
                <img className="d-block img-fluid" src="./7.jpg" alt="First slide"/>
              </div>
              <div className="carousel-item">
                <img className="d-block img-fluid" src="./6.jpg" alt="Second slide"/>
              </div>
              <div className="carousel-item">
                <img className="d-block img-fluid" src="./3.jpg" alt="Third slide"/>
              </div>
            </div>
            <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="sr-only">Next</span>
            </a>
          </div>

          <button type="button block" className="btn btn-secondary btn-lg" onClick={() => this.pushToChooseTodayActivities()}>14:58</button>
        </span>
      </div>
    );
  }
}

export default TodayActivities;
