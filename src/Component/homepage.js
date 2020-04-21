import React, { useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Input,
  Button,
  Select,
  StepLabel,
} from "@material-ui/core";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  expenseform: {
    width: theme.spacing.unit * 70,
    marginTop: theme.spacing.unit * 20,
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px ${
      theme.spacing.unit * 3
    }px`,
  },
  apptitle: {
    float: "left",
  },
  navtitle: {
    float: "right",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  formlabel: {
    float: "left",
  },
  submitbtn: {
    paddingTop: theme.spacing(10),
  },
  form: {
    width: "60%",
  },
  datepicker: {
    float: "left",
  },
  datepickerfield: {
    height: theme.spacing(5),
  },
});

function Homepage(props) {
  const { classes } = props;

  const [amount, setamount] = useState("");
  const [description, setdescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [amountType, setamountType] = useState("Debit");

  return (
    <div className={classes.root}>
      <div>
        <div className={classes.apptitle}>
          <Typography component="h6" variant="h4">
            Expense Sheet
          </Typography>
        </div>
        <div className={classes.navtitle}>
          <Button component={Link} to="/" variant="outlined" color="primary">
            Home
          </Button>
          <Button component={Link} to="/expensedata" variant="outlined" color="primary">
            Expense Data
          </Button>
          <Button  onClick={() => fire.auth().signOut()} variant="outlined" color="primary">
            Logout
          </Button>
        </div>
      </div>

      <Paper className={classes.expenseform} elevation={3}>
        <form
          className={classes.form}
          onSubmit={(e) => e.preventDefault() && false}>
          <Typography component="h2" variant="h6">
            {" "}
            Enter Your Expenses Here!!
          </Typography>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel htmlFor="outlined-age-native-simple">Type</InputLabel>
            <Select
              native
              value={amountType}
              autoFocus
              onChange={(e) => setamountType(e.target.value)}
              label="Age"
              inputProps={{
                name: "age",
                id: "outlined-age-native-simple",
              }}>
              <option aria-label="None" value="" />
              <option value={"Credit"}>Credit</option>
              <option value={"Debit"}>Debit</option>
            </Select>
          </FormControl>
          <br></br>
          <FormControl margin="normal" required size="medium" fullWidth>
            <InputLabel htmlfor="amount">Amount</InputLabel>
            <Input
              id="amount"
              type="number"
              name="amount"
              autoComplete="off"              
              value={amount}
              onChange={(e) => setamount(e.target.value)}
            />
          </FormControl>
          <br></br>
          <FormControl className={classes.datepicker} full width>
            <StepLabel>Date</StepLabel>
            <Datepicker
              className={classes.datepickerfield}
              id="date"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}></Datepicker>
          </FormControl>
          <br></br>
          <FormControl margin="normal" required size="medium" fullWidth>
            <InputLabel htmlfor="description">Description</InputLabel>
            <Input
              id="description"
              type="text"
              name="description"
              autoComplete="off"
              
              value={description}
              onChange={(e) => setdescription(e.target.value)}
            />
          </FormControl>
          <br></br>
          <FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={submitform}
              className={classes.submit}>
              Submit
            </Button>
          </FormControl>
        </form>
      </Paper>
    </div>
  );

  async function submitform() {
    try {
      console.log(amount);
      console.log(description);
      console.log(selectedDate);
      console.log(amountType);
      var timestamp = Math.round(selectedDate.getTime() / 1000);
      var userid = fire.auth().currentUser.uid;
      var today = new Date();
      console.log(today)
      console.log(userid);
      var data = {
        amountType: amountType,
        amount: amount,
        description: description,
        createdAt: selectedDate,
        updateAt: today,
        onservercreatedAt:today,
        userId: userid,
        isDeleted: 0,
      };
      await fire.firestore().collection("data").add(data);
      alert("Your Expense Data is added Successfully!")
      console.log(data);
      props.history.replace("/");
    } catch (error) {
      alert(error.message);
    }
  }
  
}
export default withRouter(withStyles(styles)(Homepage));
