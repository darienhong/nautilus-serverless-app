import React from "react";
import './App.css';
import Amplify from 'aws-amplify';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import AuthStateApp from "./components/Auth";
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import EventPage from './components/Events';
import EventInfo from './components/EventInfo';
import Homepage from './components/Homepage';
import TeamInfo from './components/TeamInfo';

Amplify.configure({
  API: {
    endpoints: [
      {
        name: "race-api",
        endpoint: "https://rsnjuggb6c.execute-api.us-east-1.amazonaws.com/prod/",
      }
    ]
  }
})

const App = () => {
  return (
    <Router>
      <Switch>
      <Route path="/Dashboard/:teamId">
          <TeamInfo />
        </Route>
        <Route path="/Dashboard">
          <Dashboard />
        </Route>
        <Route path="/LogIn">
          <AuthStateApp />
        </Route>
        <Route path="/Events">
          <EventPage />
        </Route>
        <Route path="/Home">
          <Homepage />
        </Route>
        <Route path="/:eventId">
          <EventInfo />
        </Route>
        <Route path="/">
          <LandingPage />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
