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

function Signup(props) {
  const { classes } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  return (
    <div className={classes.root}>
      <Typography component="h1" variant="h4">
        Expense Sheet
      </Typography>

      <Paper className={classes.login} elevation={3}>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form
          className={classes.form}
          onSubmit={(e) => e.preventDefault() && false}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlfor="name">Name</InputLabel>
            <Input
              id="name"
              name="username"
              autoComplete="off"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
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
              id="email"
              name="password"
              type="password"
              autoComplete="off"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={signup}
            className={classes.submit}>
            Sign up
          </Button>
          <Typography>or connect with</Typography>
          <GoogleButton
            className={classes.googlebtn}
            onClick={() => {
              googlesignin();
            }}
          />
          <Typography>Already have an account?</Typography>
          <Button component={Link} to="/" color="primary">
            {" "}
            Sign in
          </Button>
        </form>
      </Paper>
    </div>
  );

  async function signup() {
    try {
      await fire.auth().createUserWithEmailAndPassword(email, password);
      await fire.auth().currentUser.updateProfile({
        displayName: username,
      });
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
export default withRouter(withStyles(styles)(Signup));
