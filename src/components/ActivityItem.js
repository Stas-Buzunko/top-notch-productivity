import React from 'react';

const ActivityItem = ({ activity, isChoosable, isChosen, isEditable, isDeletable, onSelect, onEdit, onDelete }) => (
  <tr>
    {isChoosable && <td><input type='Checkbox' checked={isChosen} onChange={onSelect} /></td>}
    <td>{activity.name}</td>
    <td>{activity.price}</td>
    {isEditable &&
      <td>
        <i
          className="fa fa-pencil"
          aria-hidden="true"
          onClick={onEdit}
          style={{cursor: 'pointer'}}>
        </i>
      </td>}
    {isDeletable &&
      <td>
        <i
          className="fa fa-times"
          aria-hidden="true"
          onClick={onDelete}
          style={{cursor: 'pointer'}}>
        </i>
      </td>}
  </tr>
)

export default ActivityItem;
