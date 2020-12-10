import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Navigation from "./components/Navigation";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import AddCar from "./components/AddCar";
import MyCars from "./components/MyCars";
import CarView from "./components/CarView";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import Colors from "./styles/colors";

const App = () => {
  const theme = createMuiTheme({
    typography: {
      fontFamily: "Quicksand",
    },
    overrides: {
      MuiLink: {
        root: {
          fontFamily: "Quicksand",
          color: Colors.blue1,
        },
      },
      MuiTextField: {
        root: {
          backgroundColor: Colors.blue2,
        },
      },
    },
  });

  const isLoggedin = useSelector((state) => state.loginReducer);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Router>
          <Navigation />
          <Switch>
            <Route exact path="/">
              {!isLoggedin ? <Redirect to="/login" /> : <MyCars />}
            </Route>
            <Route path="/register" component={Register} />
            <Route path="/login" exact component={Login} />
            <Route path="/forgotpassword" exact component={ForgotPassword} />
            <Route exact path="/carview">
              {!isLoggedin ? <Redirect to="/login" /> : <CarView />}
            </Route>
            <Route exact path="/mycars">
              {!isLoggedin ? <Redirect to="/login" /> : <MyCars />}
            </Route>
            <Route exact path="/addcar">
              {!isLoggedin ? <Redirect to="/login" /> : <AddCar />}
            </Route>
            <Route path="/resetpassword/:id" exact component={ResetPassword} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
