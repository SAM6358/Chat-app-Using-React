import React from 'react';
import './styles/main.scss';
import { Switch } from 'react-router';
import 'rsuite/dist/styles/rsuite-default.css';
import PublicRoute from './components/PublicRoute';
import SignIn from './pages/SignIn';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';

function App() {
  return (
    <Switch>
      <PublicRoute path="/LogIn">
        <SignIn />
      </PublicRoute>
      <PrivateRoute path="/">
        <Home />
      </PrivateRoute>
    </Switch>
  );
}

export default App;
