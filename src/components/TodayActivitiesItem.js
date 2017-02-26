import React from 'react'

const TodayActivitiesItem = ({ activity, onClick }) => {
  let icon;

  if (activity.isDone) {
    icon = <i className="fa fa-check-circle-o fa-4x" aria-hidden="true" style={{color: 'green'}}></i>
  } else {
    icon = <i className="fa fa-times-circle-o fa-4x" aria-hidden="true" style={{color: 'red'}}></i>
  }

  return (
    <div onClick={onClick}>
      {icon}
      {activity.name} - ${activity.price}
    </div>
  )
}

export default TodayActivitiesItem;
