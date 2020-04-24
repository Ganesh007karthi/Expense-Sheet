import React, { useState, useEffect } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import "../style.css";
import {
  Paper,
  Typography,
  FormControl,
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
import Box from "@material-ui/core/Box"
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
  datepickerfield: {
    height: theme.spacing(5),
    width: "fullWidth",
  },
});
function ExpenseData(props) {
  const { classes } = props;
  const [alldata, setalldata] = useState([]);
  const [filterby, setfilterby] = useState("All");
  const [fetched, setfetched] = useState(false);
  const [data, setdata] = useState([]);
  const [open, setOpen] = useState(false);
  const [openadd, setOpenadd] = useState(false);
  const [amount, setamount] = useState(0);
  const [description, setdescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [amountType, setamountType] = useState("Debit");
  const [totalallcredit, settotalallcredit] = useState(0);
  const [totalalldebit, settotalalldebit] = useState(0);
  const [updateid, setupdateid] = useState("");

  useEffect(() => {
    if (fire.auth().onAuthStateChanged) {
      const userid = fire.auth().currentUser.uid;
      var options = { month: "long" };
      var date = new Date();
      var month = new Intl.DateTimeFormat("en-US", options).format(date);
      var datestring = month + " " + date.getDate() + ", " + date.getFullYear();
      var today = new Date(datestring);
      filter();
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
          let sorteddata = alldata
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt);
          setdata(sorteddata);
          setfetched(true);
        });
    }
    totalCredit(alldata);
    totalDebit(alldata);
    filter();
  }, [fetched, filterby]);
  async function handleClickOpen() {
    setOpen(true);
  }
  async function handleClickOpenAddExpense() {
    setOpenadd(true);
  }

  async function deletedata(id, userid, data1) {
    data1.isDeleted = 1;
    await fire.firestore().collection("data").doc(id).update(data1);
    console.log(id);
    filter();
    alert("deleted");
  }
  async function update(index, id, onservercreatedAt, userid) {
    setOpen(false);
    console.log(updateid);
    console.log(index);
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
    var id = updateid;

    await fire.firestore().collection("data").doc(updateid).update(data);
    setamount(0);
    setamountType("Credit");
    setdescription("");
    setSelectedDate(new Date());
    filter();
  }
  async function submitform() {
    try {
      var userid = fire.auth().currentUser.uid;
      var today = new Date();
      var data = {
        amountType: amountType,
        amount: amount,
        description: description,
        createdAt: selectedDate,
        updateAt: today,
        onservercreatedAt: today,
        userId: userid,
        isDeleted: 0,
      };
      console.log(data);
      await fire.firestore().collection("data").add(data);
      await filter();
      setOpenadd(false);
    } catch (error) {
      alert(error.message);
    }
  }
  const handleClose = () => {
    setOpen(false);
  };

  const handleaddClose = () => {
    setOpenadd(false);
  };
  async function summa(id, datamap) {
    console.log(id);
    console.log(datamap);
    await setdatainupdateform(datamap);
    setOpen(true);
    console.log(selectedDate);
    setupdateid(id);
  }
  async function setdatainupdateform(data_submit) {
    setamount(data_submit.amount);
    setamountType(data_submit.amountType);
    var timestamp = data_submit.createdAt.seconds * 1000;
    var date = new Date(timestamp);
    console.log(date);
    await setSelectedDate(date);
    setdescription(data_submit.description);
    // console.log(amount);
    // console.log(amountType);
    // console.log(description);
    console.log(data_submit);
    console.log(amount);
    return;
  }

  async function filter() {
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
          let sorteddata = alldatatoday
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt);
          setdata(sorteddata);
          totalCredit(alldatatoday);
          totalDebit(alldatatoday);
        });
    }

    if (filterby === "All") {
      var userid = fire.auth().currentUser.uid;
      await fire
        .firestore()
        .collection("data")
        .where("userId", "==", userid)
        .where("isDeleted", "==", 0)
        .onSnapshot((snapshot) => {
          var alldatatoday = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          let sorteddata = alldatatoday
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt);
          setdata(sorteddata);
          totalCredit(alldatatoday);
          totalDebit(alldatatoday);
        });
    }
    if (filterby === "7 days ago") {
      var options = { month: "long" };
      var date = new Date();
      var month = new Intl.DateTimeFormat("en-US", options).format(date);
      var datestring =
        month + " " + (date.getDate() - 7) + ", " + date.getFullYear();
      var today = new Date(datestring);
      await fire
        .firestore()
        .collection("data")
        .where("userId", "==", userid)
        .where("isDeleted", "==", 0)
        .onSnapshot((snapshot) => {
          var alldatatoday = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          let sorteddata = alldatatoday
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt);
          setdata(sorteddata);
          totalCredit(alldatatoday);
          totalDebit(alldatatoday);
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
      await fire
        .firestore()
        .collection("data")
        .where("userId", "==", userid)
        .where("isDeleted", "==", 0)
        .onSnapshot((snapshot) => {
          var alldatatoday = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          let sorteddata = alldatatoday
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt);
          setdata(sorteddata);
          totalCredit(alldatatoday);
          totalDebit(alldatatoday);
        });
    }
  }

  async function totalCredit(alldata) {
    var totalcredit = 0;
    alldata.map((eachdata) => {
      if (eachdata.amountType == "Credit") {
        if (eachdata.amount.indexOf(".") > -1) {
        } else {
          var amount = parseInt(eachdata.amount);
          totalcredit = totalcredit + amount;
        }
      }
    });
    settotalallcredit(totalcredit);
  }
  async function totalDebit(alldata) {
    var totaldebit = 0;
    alldata.map((eachdata) => {
      if (eachdata.amountType == "Debit") {
        if (eachdata.amount.indexOf(".") > -1) {
        } else {
          var amount = parseInt(eachdata.amount);
          totaldebit = totaldebit + amount;
        }
      }
    });
    settotalalldebit(totaldebit);
  }

  function getdate(time){
    console.log(time);
    var date= new Date(time * 1000);
    let datestring = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+" \t  "+date.getHours()+":"+date.getMinutes();
    return datestring
  }
  // console.log(data)
  return fetched ? (
    <div className={classes.root}>
      <div>
        <div className={classes.apptitle}>
          <Typography component="h6" variant="h4">
            Expense Sheet
          </Typography>
        </div>
        <div className={classes.navtitle}>
          <Button
            onClick={() => {
              fire.auth().signOut();
              localStorage.setItem("islogin", false);
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
                      gutterBottom
                      variant="h5"
                      component="h4">
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
                    <Typography
                      variant="h5"
                      component="h2"
                      color="textSecondary">
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
        <div className={classes.filterby} >
          <FormControl style={{marginRight:"40px",marginBottom:"20px"}}>
            <InputLabel>Filter By</InputLabel>
            <Select
              className={classes.filterby}
              native
              value={filterby}
              autoFocus
              
              onChange={(e) => {
                setfilterby(e.target.value);
              }}
              label="Filter">
              <option value={"Today"}>Today</option>
              <option value={"7 days ago"}>7 days ago</option>
              <option value={"30 days ago"}>30 days ago</option>
              <option value={"All"}>All</option>
            </Select>
          </FormControl>
          <Button
          style={{marginTop:"10px"}}
            onClick={() => {
              handleClickOpenAddExpense();
            }}
            variant="outlined"
            color="primary">
            Add Expenses
          </Button>
          <Dialog open={openadd} onClose={handleaddClose}>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogContent>
              <DialogContentText>Add your Expense Data.</DialogContentText>
              <form
                className={classes.form}
                onSubmit={(e) => e.preventDefault() && false}>
                <Typography component="h2" variant="h6">
                  {" "}
                  Enter Your Expenses Here!!
                </Typography>
                <FormControl className={classes.formControl} fullWidth>
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
              </form>
              <DialogActions>
                <Button onClick={handleaddClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={submitform} color="primary">
                  Add
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
        </div>
        {data.length > 0 === true ? (
          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              aria-label="simple table"
              stickyHeader="true">
              <TableHead>
                <TableRow>
                  <TableCell align="center">S.No</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Amount Type</TableCell>
                  <TableCell align="right">Description</TableCell>

                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((eachdata, index) => (
                  <TableRow key={index}>
                    <TableCell align="right">{index + 1}</TableCell>
                    <TableCell align="center">
                      {getdate(eachdata.createdAt.seconds)}
                    </TableCell>
                    <TableCell align="left">Rs.{eachdata.amount}</TableCell>
                    <TableCell align="right">{eachdata.amountType}</TableCell>
                    <TableCell align="right">{eachdata.description}</TableCell>

                    <TableCell align="center">
                      <IconButton
                        onClick={() => {
                          // handleClickOpen();
                          summa(eachdata.id, eachdata);
                        }}>
                        <EditIcon color="primary" />
                      </IconButton>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        maxWidth="700xl">
                        <DialogTitle>Update Expense</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            To update this expense, enter the new expense
                            details.
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
                                index,
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
        ) : (
          <h1>No data!</h1>
        )}
      </div>
    </div>
  ) : (
    <div id="loader">
      <CircularProgress />
    </div>
  );
}

export default withRouter(withStyles(styles)(ExpenseData));
