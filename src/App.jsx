import "./style.css";
import React from "react";
import Login from "./Component/login";
import HomePage from "./Component/homepage";
import Signup from "./Component/signup";
import Resetpassword from "./Component/resetpassword";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { CssBaseline} from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./Component/Auth";

const App = () => {
  return (
    <AuthProvider>
      <MuiThemeProvider>
        <CssBaseline />
        <Router>
          <Switch>
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/" component={Login } />
            <Route exact path="/expense" component={HomePage} />
            <Route exact path="/resetpassword" component={Resetpassword} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    </AuthProvider>
  );
};

export default App;
