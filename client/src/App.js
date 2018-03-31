import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Profile from './profile';
import CourtView from './courtview';
import Main from './main';
import Header from './header';
import NotFound from './notFound'

class App extends Component {

  constructor(props){
    super(props);

    // Create routes object for cleaner code.
    this.routes = {
      mainPage : "/",
      profilePage : "/profile/:nameParam",
      courtViewPage : "/court/:id",
      notFoundPage : "/404"
    };

    this.state = {
      loggedIn : true,
      currentUser: 'user1'
    }

  }

  render(){
    return (
      <div>
        <Header loginValue={this.state.loggedIn} currentUser={this.state.currentUser}/>
        <Router>
          <Switch>
              <Route exact path={this.routes.mainPage} component={Main}/>
              <Route exact path={this.routes.profilePage} component={Profile}/>
              <Route exact path={this.routes.courtViewPage} component={CourtView}/>
              <Route exact path={this.routes.notFoundPage} component={NotFound}/>
              <Route component={NotFound}/>
          </Switch>
        </Router>
      </div>
    );
  }

}

export default App;
