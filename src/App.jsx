import "./style.css";
import React, { Component } from "react";
import Login from "./Component/login";
import HomePage from "./Component/homepage";
import Signup from "./Component/signup";
import Resetpassword from "./Component/resetpassword";
import Expensedata from "./Component/expensedata";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { CssBaseline, CircularProgress } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import fire from "./Component/firebase";

class App extends Component {
  state = { isSignedIn: false, user: null };

  componentDidMount = () => {
    fire.auth().onAuthStateChanged((user) => {
      this.setState({ isSignedIn: !!user });
      this.setState({ user: user });
      localStorage.setItem('islogin', false);
    });
  };

  render() {
    return (
      <MuiThemeProvider>
        <CssBaseline />
        <Router>
          <Switch>
            <Route exact path="/signup" component={Signup} />
            <Route
              exact
              path="/"
              component={() => {
                return this.state.isSignedIn === false ? (
                  <Login />
                ) : (
                  <Expensedata />
                );
              }}
            />
            <Route exact path="/expense" component={HomePage} />
            <Route exact path="/resetpassword" component={Resetpassword} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
