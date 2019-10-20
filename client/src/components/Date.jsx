/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import styles from '../styles/calendar.css';


const Date = (props) => {
  const { number, status, handleSelect } = props;
  return (
    <td
      className={styles[status]}
      onClick={(event, num) => { handleSelect(event, number); }}
    >
      {number}
    </td>
  );
};

export default Date;
