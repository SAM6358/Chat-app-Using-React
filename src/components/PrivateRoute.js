import React from 'react';
import { Redirect } from 'react-router';
import { Route } from 'react-router-dom';

const PrivateRoute = ({ children, ...routeProps }) => {
  const profile = true;

  if (!profile) {
    return <Redirect to="/LogIn" />;
  }

  return <Route {...routeProps}>{children}</Route>;
};

export default PrivateRoute;
