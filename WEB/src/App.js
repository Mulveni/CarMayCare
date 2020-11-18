import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { useSelector } from 'react-redux';
import Navigation from './components/Navigation';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Error from './components/Error';

const App = () => {
    const isLoggedin = useSelector(state => state.loginReducer);

    return (
        <div>
            <Router>
                <Navigation />
                <Switch>
                    <Route exact path="/">
                        {!isLoggedin ? <Redirect to="/login" /> : <Profile />}
                    </Route>

                    <Route path="/register" component={Register} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/forgotpassword" exact component={ForgotPassword} />
                    <Route path="/resetpassword/:id" exact component={ResetPassword} />
                    <Route path="/error" exact component={Error} />
                    <Route component={NotFound} />
                </Switch>



            </Router>
        </div >
    )
}

export default App;