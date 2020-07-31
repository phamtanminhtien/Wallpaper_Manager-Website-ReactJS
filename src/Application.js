import React from 'react';
import Routes from './Routes';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';


const browserHistory = createBrowserHistory();
function Application() {
  return (
    <Router history={browserHistory}>
      <Routes />
    </Router>
  );
}
export default Application;