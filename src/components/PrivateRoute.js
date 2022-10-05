import React from 'react';
import { Redirect, Route } from 'react-router';
import { useProfile } from '../context/profile.context';

// eslint-disable-next-line spaced-comment
//import { Container, Loader } from 'rsuite';
const PrivateRoute = ({ children, ...routeProps }) => {
  const { profile, isLoading } = useProfile();

  // if (isLoading && !profile) {
  //   return (
  //     <Container>
  //       <Loader center vertical size="md" content="Loading..." speed="slow" />
  //     </Container>
  //   );
  // }

  if (!isLoading && !profile) {
    return <Redirect to="/SignIn" />;
  }

  return <Route {...routeProps}>{children}</Route>;
};

export default PrivateRoute;
