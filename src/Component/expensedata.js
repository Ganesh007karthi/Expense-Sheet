import React, { useState, useEffect } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import "../style.css";
import {
  Paper,
  Typography,
  FormControl,
  Form,
  Input,
  InputLabel,
  Button,
  Select,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  StepLabel,
  Card,
  CardContent,
  Grid,
} from "@material-ui/core";
import Datepicker from "react-datepicker";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
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
    width: "80%",
    marginTop: theme.spacing.unit * 5,
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
  form: {
    width: "100%",
  },
  filterby: {
    float: "left",
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(30),
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  card: {
    paddingTop: theme.spacing(10),
    width: "40%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  pos: {
    marginBottom: 12,
  },
  grid: {
    flexgrow: 1,
  },
});
function ExpenseData(props) {
  const { classes } = props;
  const [alldata, setalldata] = useState([]);
  const [filterby, setfilterby] = useState("Today");
  const [fetched, setfetched] = useState(false);
  const [data, setdata] = useState([]);
  const [open, setOpen] = useState(false);
  const [amount, setamount] = useState("");
  const [description, setdescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [amountType, setamountType] = useState("Debit");
  const [totalallcredit, settotalallcredit] = useState(0);
  const [totalalldebit, settotalalldebit] = useState(0);

  useEffect(() => {
    if (fetched === false && fire.auth().onAuthStateChanged) {
      const userid = fire.auth().currentUser.uid;
      var options = { month: "long" };
      var date = new Date();
      var month = new Intl.DateTimeFormat("en-US", options).format(date);
      var datestring = month + " " + date.getDate() + ", " + date.getFullYear();
      var today = new Date(datestring);
      filter();
      console.log(selectedDate);
      const unsubscribe = fire
        .firestore()
        .collection("data")
        .where("userId", "==", userid)
        .where("isDeleted", "==", 0)
        .where("createdAt", ">", today)
        .onSnapshot((snapshot) => {
          const alldata = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log(alldata);
          setdata(alldata);
          setalldata(alldata);
          setfetched(true);
        });
    }
    totalCredit(alldata);
    totalDebit(alldata);
  }, [fetched]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  async function deletedata(id, userid, data1) {
    // await fire.firestore().collection('data').doc(id).delete()
    console.log(data1.isDeleted);
    data1.isDeleted = 1;
    await fire.firestore().collection("data").doc(id).update(data1);
    // var unsubscribe = fire
    //   .firestore()
    //   .collection("data")
    //   .where("userId", "==", userid)
    //   .where("isDeleted", "==", 0)
    //   .onSnapshot((snapshot) => {
    //     const alldata = snapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //     console.log(alldata);
    //     setdata(alldata);
    //   });
    filter();
    alert("deleted");
  }
  async function update(id, onservercreatedAt, userid) {
    var testdata = [];
    setdata(testdata);
    console.log(id);
    setOpen(false);

    var data = {
      amountType: amountType,
      amount: amount,
      description: description,
      createdAt: selectedDate,
      onservercreatedAt: onservercreatedAt,
      updateAt: selectedDate,
      userId: userid,
      isDeleted: 0,
    };
    await fire.firestore().collection("data").doc(id).update(data);

    // var unsubscribe = fire
    //   .firestore()
    //   .collection("data")
    //   .where("userId", "==", userid)
    //   .where("isDeleted", "==", 0)
    //   .onSnapshot((snapshot) => {
    //     const alldata = snapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));
    //     console.log(alldata);
    //     setdata(alldata);
    //   });
    filter();
    alert("updated");
    console.log(data);
  }
  const handleClose = () => {
    setOpen(false);
  };

  async function filter() {
    var newdata = [];
    var test = 0;
    settotalallcredit(test);
    settotalalldebit(test);
    setdata(newdata);
    var userid = fire.auth().currentUser.uid;
    if (filterby === "Today") {
      var options = { month: "long" };
      var date = new Date();
      var month = new Intl.DateTimeFormat("en-US", options).format(date);
      var datestring = month + " " + date.getDate() + ", " + date.getFullYear();
      var today = new Date(datestring);
      const unsubscribe = fire
        .firestore()
        .collection("data")
        .where("userId", "==", userid)
        .where("isDeleted", "==", 0)
        .where("createdAt", ">", today)
        .onSnapshot((snapshot) => {
          var alldatatoday = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setdata(alldatatoday);
          totalCredit(alldatatoday);
          totalDebit(alldatatoday);
        });
    }

    if (filterby === "All") {
      var userid = fire.auth().currentUser.uid;
      const unsubscribe = fire
        .firestore()
        .collection("data")
        .where("userId", "==", userid)
        .where("isDeleted", "==", 0)
        .onSnapshot((snapshot) => {
          var alldatatoday = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setdata(alldatatoday);
          totalCredit(alldatatoday);
          totalDebit(alldatatoday);
        });
    }
    if (filterby === "7 days ago") {
      setdata([]);

      var options = { month: "long" };
      var date = new Date();
      var month = new Intl.DateTimeFormat("en-US", options).format(date);
      var datestring =
        month + " " + (date.getDate() - 7) + ", " + date.getFullYear();
      var today = new Date(datestring);
      console.log(today);
      const unsubscribe = fire
        .firestore()
        .collection("data")
        .where("userId", "==", userid)
        .where("isDeleted", "==", 0)
        .where("createdAt", ">", today)
        .onSnapshot((snapshot) => {
          var alldatatoday = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          totalCredit(alldatatoday);
          totalDebit(alldatatoday);
          setdata(alldatatoday);
        });
    }
    if (filterby === "30 days ago") {
      var options = { month: "long" };
      var date = new Date();
      var previousmonth = new Date();
      previousmonth.setDate(previousmonth.getDate() - 30);
      var month = new Intl.DateTimeFormat("en-US", options).format(date);
      var datestring =
        month + " " + (date.getDate() - 40) + ", " + date.getFullYear();
      var today = new Date(datestring);
      console.log(previousmonth);
      const unsubscribe = fire
        .firestore()
        .collection("data")
        .where("userId", "==", userid)
        .where("isDeleted", "==", 0)
        .where("createdAt", ">", previousmonth)
        .onSnapshot((snapshot) => {
          var alldatatoday = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setdata(alldatatoday);
          totalCredit(alldatatoday);
          totalDebit(alldatatoday);
        });
    }
  }

  async function totalCredit(alldata) {
    console.log(alldata.length);
    console.log(typeof alldata);
    var totalcredit = 0;
    alldata.map((eachdata) => {
      console.log(eachdata.amountType);
      if (eachdata.amountType == "Credit") {
        if (eachdata.amount.indexOf(".") > -1) {
        } else {
          var amount = parseInt(eachdata.amount);
          totalcredit = totalcredit + amount;
          console.log(amount);
        }
      }
    });
    settotalallcredit(totalcredit);
  }
  async function totalDebit(alldata) {
    var totaldebit = 0;
    alldata.map((eachdata) => {
      console.log(eachdata.amountType);
      if (eachdata.amountType == "Debit") {
        if (eachdata.amount.indexOf(".") > -1) {
        } else {
          var amount = parseInt(eachdata.amount);
          totaldebit = totaldebit + amount;
          console.log(amount);
        }
      }
    });
    console.log(data.length);
    console.log(totaldebit);
    settotalalldebit(totaldebit);
  }

  console.log(totalallcredit);
  console.log(data);
  return fetched ? (
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
          <Button
            component={Link}
            to="/expensedata"
            variant="outlined"
            color="primary">
            Expense Data
          </Button>
          <Button
            onClick={() => {
              fire.auth().signOut();
              props.history.replace("/");
            }}
            variant="outlined"
            color="primary">
            Logout
          </Button>
        </div>
      </div>
      <div className={classes.card}>
        <Grid container className={classes.grid} spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={2}>
              <Grid key={1} item>
                <Card className={classes.root} variant="outlined">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="Primary"
                      gutterBottom variant="h5" component="h4">
                      Total Credit
                    </Typography>
                    <Typography variant="h5" component="h2" color="Primary">
                      Rs.{totalallcredit}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid key={2} item>
                <Card className={classes.root} variant="outlined">
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom>
                      Total Debit
                    </Typography>
                    <Typography variant="h5" component="h2" color="textSecondary">
                      Rs.{totalalldebit}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>

      <div className={classes.expenseform}>
        <div className={classes.filterby}>
          <FormControl>
            <InputLabel>Filter By</InputLabel>
            <Select
              className={classes.filterby}
              native
              value={filterby}
              autoFocus
              onChange={(e) => setfilterby(e.target.value)}
              label="Filter">
              <option value={"Today"}>Today</option>
              <option value={"7 days ago"}>7 days ago</option>
              <option value={"30 days ago"}>30 days ago</option>
              <option value={"All"}>All</option>
            </Select>
          </FormControl>
          <Button onClick={() => filter()} variant="outlined" color="primary">
            Filter
          </Button>
        </div>
        <TableContainer component={Paper}>
          <Table
            className={classes.table}
            aria-label="simple table"
            stickyHeader="true">
            <TableHead>
              <TableRow>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Amount Type</TableCell>
                <TableCell align="right">Description</TableCell>

                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((eachdata) => (
                <TableRow key={eachdata.amount}>
                  <TableCell align="left">Rs.{eachdata.amount}</TableCell>
                  <TableCell align="right">{eachdata.amountType}</TableCell>
                  <TableCell align="right">{eachdata.description}</TableCell>

                  <TableCell align="center">
                    <IconButton onClick={handleClickOpen}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <Dialog open={open} onClose={handleClose} maxWidth="700xl">
                      <DialogTitle>Update Expense</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          To update this expense, enter the new expense details.
                        </DialogContentText>
                        <form
                          className={classes.form}
                          onSubmit={(e) => e.preventDefault() && false}>
                          <FormControl
                            className={classes.formControl}
                            fullWidth>
                            <InputLabel htmlFor="outlined-age-native-simple">
                              Type
                            </InputLabel>
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
                          <FormControl
                            margin="normal"
                            required
                            size="medium"
                            fullWidth>
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
                          <FormControl
                            className={classes.datepicker}
                            full
                            width>
                            <StepLabel>Date</StepLabel>
                            <Datepicker
                              className={classes.datepickerfield}
                              id="date"
                              selected={selectedDate}
                              onChange={(date) =>
                                setSelectedDate(date)
                              }></Datepicker>
                          </FormControl>
                          <br></br>
                          <FormControl
                            margin="normal"
                            required
                            size="medium"
                            fullWidth>
                            <InputLabel htmlfor="description">
                              Description
                            </InputLabel>
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
                        </form>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose} color="primary">
                          Cancel
                        </Button>
                        <Button
                          onClick={() =>
                            update(
                              eachdata.id,
                              eachdata.onservercreatedAt,
                              eachdata.userId
                            )
                          }
                          color="primary">
                          Update
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <IconButton
                      onClick={() =>
                        deletedata(eachdata.id, eachdata.userId, eachdata)
                      }>
                      <DeleteIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  ) : (
    <div id="loader">
      <CircularProgress />
    </div>
  );
}

export default withRouter(withStyles(styles)(ExpenseData));
