import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Input,
  Button,
} from "@material-ui/core";
import GoogleButton from "react-google-button";
import { Link, withRouter } from "react-router-dom";

import fire from "./firebase";
import firebase from "firebase";
const styles = (theme) => ({
  root: {
    display: "block",
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 3,
    textAlign: "center",
  },
  login: {
    width: theme.spacing.unit * 40,
    marginTop: theme.spacing.unit * 8,
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${
      theme.spacing.unit * 3
    }px`,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  googlebtn: {
    marginLeft: "auto",
    marginRight: "auto",
  },
});

function Login(props) {
  const { classes } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={classes.root}>
      <Typography component="h1" variant="h4">
        Expense Sheet
      </Typography>
      <Paper className={classes.login} elevation={3}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form
          className={classes.form}
          onSubmit={(e) => e.preventDefault() && false}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlfor="email">Email Address</InputLabel>
            <Input
              id="email"
              name="email"
              autoComplete="off"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlfor="password">Password</InputLabel>
            <Input
              id="password"
              type="password"
              name="password"
              autoComplete="off"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button component={Link} to="/resetpassword" color="primary">
            Forget password?
          </Button>
          <br></br>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={login}
            className={classes.submit}>
            Sign in
          </Button>
          <Typography>
            New to Expense sheet?
            <Button component={Link} to="/signup" color="primary">
              {" "}
              Sign up
            </Button>
          </Typography>
          <Typography>or connect with</Typography>
          <GoogleButton
            className={classes.googlebtn}
            onClick={() => {
              googlesignin();
            }}
          />
        </form>
      </Paper>
    </div>
  );

  async function login() {
    try {
      await fire.auth().signInWithEmailAndPassword(email, password);
      props.history.replace("/");
    } catch (error) {
      alert(error.message);
    }
  }
  async function googlesignin() {
    try {
      var provider = new firebase.auth.GoogleAuthProvider();
      await fire.auth().signInWithPopup(provider);
      props.history.replace("/");
    } catch (error) {
      alert(error.message);
    }
  }
}
export default withRouter(withStyles(styles)(Login));
