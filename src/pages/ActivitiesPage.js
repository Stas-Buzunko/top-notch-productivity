import React, { Component } from 'react'
import ActivityList from '../components/ActivityList'
import { browserHistory } from 'react-router';

class ActivitiesPage extends Component {
  render() {
    const { user } = this.props;
    return (
      <div>
         <ActivityList isChoosable={false} user={user} />
        {user.activities && Boolean(user.activities.length) &&
          <button
          type="button block"
          className="btn btn-secondary btn-lg"
          onClick={() => browserHistory.push('/')}
          style={{display: 'block', margin: 'auto'}}
          >  Return to main page  </button>
        }
      </div>
    )
  }
}

export default ActivitiesPage;
