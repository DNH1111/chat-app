// React Component
// It will imitate like the Route Component from 'react-router'
// This component will grant access to other components only when some conditions are fulfilled.
// for eg: giving access to the Homeage Component only if the user is signed-in.
import React from 'react';
import { Redirect, Route } from 'react-router';

const PrivateRoute = ({ children, ...routeProps }) => {
  const profile = false;

  if (!profile) {
    // if user not signed-in, redirect to sign-in page
    return <Redirect to="/signin" />;
  }

  // else, direct user to the component inside {children}
  return <Route {...routeProps}>{children}</Route>;
};

export default PrivateRoute;
