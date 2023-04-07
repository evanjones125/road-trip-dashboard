import React from 'react';
import '../Input.css';

const Input: React.FC = (): JSX.Element => {
  return (
    <>
      <h2>Add a trip to your dashboard</h2>
      <form className="form">
        <div className="form-row">
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location"></input>
        </div>

        <div>
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date"></input>
        </div>
      </form>
    </>
  );
};

export default Input;
