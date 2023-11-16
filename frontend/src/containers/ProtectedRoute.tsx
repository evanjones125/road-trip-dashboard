import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem('token');

  // show unauthorized screen if no user is found in redux store
  if (!isLoggedIn) {
    return (
      <div className="unauthorized">
        <h1>Unauthorized</h1>
        <p>
          Your session may have expired or you may have never logged in to begin
          with.
        </p>
        <span>
          Head over to the <NavLink to="/login">Login</NavLink> page to gain
          access
        </span>
      </div>
    );
  }

  // returns child route elements
  return <Outlet />;
};
export default ProtectedRoute;
