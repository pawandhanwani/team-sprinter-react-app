import React, { Component } from 'react';

import Layout from './Containers/Layout/Layout';
import Authentication from './Containers/Authentication/Authentication';
import Sprints from './Containers/Sprints/Sprints';
import TaskManager from './Containers/TaskManager/TaskManager';
import Logs from './Containers/Logs/Logs';

import {Route , Switch, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import './App.css';

class App extends Component {
  
  render() {
    let routes = null;
    if(this.props.isAuthenticated)
    {
      routes =(
        <Switch>
          <Route path="/sprints" component={Sprints}/>
          <Route path="/tasks/:sprintID" component={TaskManager}/>
          <Route path="/logs/:sprintID" component={Logs}/>
          <Redirect from="/" to="/sprints" />
        </Switch>
      )
    }
    else
    {
      routes = (
        <Switch>
          <Route path="/" component={Authentication}/>
        </Switch>
      )
    }
    return (
      <div className="App">
        <Layout/>
        {routes}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    isAuthenticated : state.auth.token!==null
  }
}
export default connect(mapStateToProps)(App);
