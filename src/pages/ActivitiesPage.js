import React, { Component } from 'react'
import ActivityList from '../components/ActivityList'
import NewActivityList from '../components/NewActivityList'

class ActivitiesPage extends Component {
  render() {
    const { user } = this.props;
    return (
      <div>
        <NewActivityList isChoosable={false} user={user} />
      </div>
    )
  }
}

export default ActivitiesPage;
