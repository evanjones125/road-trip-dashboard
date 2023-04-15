import React, { useState } from 'react';

const Input: React.FC = (): JSX.Element => {
  const [count, setCount] = useState(0);

  const handleSubmit = (): void => {
    setCount(count + 1);
    console.log(count);
  };

  return (
    <>
      <h2>Add a trip to your dashboard</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location"></input>
        </div>

        <div>
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date"></input>
        </div>

        <div>
          <input type="submit" value="Add"></input>
        </div>
      </form>
    </>
  );
};

export default Input;
