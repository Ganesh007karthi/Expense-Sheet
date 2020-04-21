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
import { Link, withRouter } from "react-router-dom";
import fire from "./firebase";
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

function Restpassword(props) {
  const { classes } = props;

  const [email, setEmail] = useState("");

  return (
    <div className={classes.root}>
      <Typography component="h1" variant="h4">
        Expense Sheet
      </Typography>

      <Paper className={classes.login} elevation={3}>
        <Typography component="h1" variant="h5">
          Reset password
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

          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={forgetpassword}
            className={classes.submit}>
            Send me a rest link
          </Button>

          <Button component={Link} to="/" color="primary">
            {" "}
            back to login page
          </Button>
        </form>
      </Paper>
    </div>
  );

  async function forgetpassword() {
    try {
      await fire.auth().sendPasswordResetEmail(email);

      props.history.replace("/");
    } catch (error) {
      alert(error.message);
    }
  }
}
export default withRouter(withStyles(styles)(Restpassword));
