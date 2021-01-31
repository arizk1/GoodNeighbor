import React from "react";
import Registration from "./registration";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";
import ResetPassword from "./resetPassword";
import { Link } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="welcome">
            <h1 className="welcome-text">
                Share love with your amazing neighbors, and make the world a bit
                nicer place!
            </h1>
            {/* 
            <h2 className="now">
                Sign up now and be in contact with members living within 2 km
            </h2> */}
            <div className="welcome-container">
                <img className="background " src="people1.jpg" />

                <img className="welcome-logo" src="/logo1.png" />

                <div className="welcome-table">
                    <HashRouter>
                        <div>
                            <Route exact path="/" component={Registration} />
                            <Route path="/login" component={Login} />
                            <Route
                                path="/reset-password"
                                component={ResetPassword}
                            />
                        </div>
                    </HashRouter>
                </div>
            </div>
        </div>
    );
}
