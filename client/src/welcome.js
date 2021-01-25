import React from "react";
import Registration from "./registration";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";
import ResetPassword from "./resetPassword";
import { Link } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="welcome">
            <div className="welcome-container">
                <div className="welcome-text">
                    <h2>GoodNeighbor</h2>

                    <p>Be a Good Neighbor and join our amazing community!</p>
                </div>

                {/* <div className="welcome-img">
                    <img src="/welcomepic.png" />
                </div> */}

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
