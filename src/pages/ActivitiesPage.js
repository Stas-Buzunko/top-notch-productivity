import React, { Component } from 'react'
import ActivityList from '../components/ActivityList'

class ActivitiesPage extends Component {
  render() {
    const { user } = this.props;
    return (
      <div>
         <ActivityList isChoosable={false} user={user} />
      </div>
    )
  }
}

export default ActivitiesPage;
