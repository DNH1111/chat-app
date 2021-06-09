// React Component
// It will imitate like the Route Component from 'react-router'

import React from 'react';
import { Redirect, Route } from 'react-router';

const PublicRoute = ({ children, ...routeProps }) => {
  const profile = false;

  if (profile) {
    // if user is signed-in, redirect to homepage
    return <Redirect to="/" />;
  }

  // else, direct user to the component inside {children}
  return <Route {...routeProps}>{children}</Route>;
};

export default PublicRoute;
