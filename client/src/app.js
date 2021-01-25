import { Component } from "react";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import axios from "./axios";
import Profile from "./profile";
import { BrowserRouter, Route, Link } from "react-router-dom";
// import OtherProfile from "./otherProfile";
import Welcome from "./welcome";
import Account from "./account";
import GoogleMap from "./google";
import AddTool from "./addTool";
import Tool from "./tool";
import MyItems from "./myItems";

export default class App extends Component {
    constructor() {
        super();
        // I'm hardcoding but you will be retrieving this data from axios!
        this.state = {
            first: null,
            last: null,
            id: null,
            profile_pic: null,
            bio: null,
            uploaderIsVisible: false,
        };
        // we could bind setImage with the arrow function syntax, too!
        this.setImage = this.setImage.bind(this);
        this.toggleUploader = this.toggleUploader.bind(this);
        this.addBio = this.addBio.bind(this);
    }
    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                console.log(data);
                this.setState({
                    id: data[0].id,
                    first: data[0].first,
                    last: data[0].last,
                    email: data[0].email,
                    profile_pic: data[0].profile_pic,
                    bio: data[0].bio,
                    postal_code: data[0].postal_code,
                    house_number: data[0].house_number,
                    street: data[0].street,
                    city: data[0].city,
                });
            })
            .catch((error) => {
                console.log("error: ", error);
            });
    }

    // this is passed down to ProfilePic as a prop
    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    // this is passed to Uploader as a prop
    setImage(newProfilePic) {
        console.log("newProfilePic: ", newProfilePic);
        this.setState({
            profile_pic: newProfilePic,
        });
    }

    logout() {
        axios.get("/logout").then(() => location.replace("/welcome"));
    }

    addBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    render() {
        if (!this.state.id) {
            return null;
        }
        return (
            <>
                <BrowserRouter>
                    <div className="app-container">
                        <section className="topnav">
                            <div className="logo">
                                <Link to="/">
                                    {/* <img src="/logo2.png" /> */}
                                </Link>
                                <h1>GoodNeighbor</h1>
                            </div>
                            <div className="topnavL">
                                {/* <div className="topnav-links">
                                    <Link to="/message">messages</Link>
                                </div> */}

                                <div className="topnav-links">
                                    <Link to="/add">
                                        <img src="/conifer-plus.png" />
                                    </Link>
                                </div>
                                <div className="topnav-links">
                                    <Link to="/my-items">
                                        <img src="/flame-527.png" />
                                    </Link>
                                </div>
                                <div className="topnav-links">
                                    <Link to="/messages">
                                        <img src="/flame-119.png" />
                                    </Link>
                                </div>
                                <div className="topnav-links">
                                    <Link to="/requests">
                                        <img src="/flame-75.png" />
                                    </Link>
                                </div>
                                <div className="topnav-links">
                                    <button onClick={() => this.logout()}>
                                        Logout
                                    </button>
                                </div>
                            </div>

                            <div className="topnav-pic">
                                <ProfilePic
                                    toggleUploader={this.toggleUploader}
                                    first={this.state.first}
                                    last={this.state.last}
                                    profile_pic={this.state.profile_pic}
                                />
                            </div>
                        </section>

                        {this.state.uploaderIsVisible && (
                            <Uploader setImage={this.setImage} />
                        )}

                        {/* <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    profile_pic={this.state.profile_pic}
                                    bio={this.state.bio}
                                    addBio={this.addBio}
                                    toggleUploader={this.toggleUploader}
                                />
                            )}
                        /> */}

                        {/* <GoogleMap
                            postal_code={this.state.postal_code}
                            house_number={this.state.house_number}
                            street={this.state.street}
                            city={this.state.city}
                        /> */}

                        <Route
                            exact
                            path="/account"
                            render={() => (
                                <Account
                                    first={this.state.first}
                                    last={this.state.last}
                                    email={this.state.email}
                                    bio={this.state.bio}
                                    postal_code={this.state.postal_code}
                                    house_number={this.state.house_number}
                                    street={this.state.street}
                                    city={this.state.city}
                                    profile_pic={this.state.profile_pic}
                                    addBio={this.addBio}
                                    toggleUploader={this.toggleUploader}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/add"
                            render={() => (
                                <AddTool
                                    userId={this.state.id}
                                    // lng={this.state.first}
                                    // ltd={this.state.last}
                                />
                            )}
                        />
                        {/* <Route
                            path="/user/:id/tool/:tool-id"
                            render={(props) => (
                                <Tool
                                    match={props.match}
                                    key={props.match.url}
                                    history={props.history}
                                    id={this.state.id}
                                />
                            )}
                        /> */}
                        <Route
                            exact
                            path="/my-items"
                            render={() => (
                                <MyItems
                                    userId={this.state.id}
                                    // lng={this.state.first}
                                    // ltd={this.state.last}
                                />
                            )}
                        />

                        {/* <Route
                            exact
                            path="/friends"
                            render={(props) => (
                                <Friends
                                    match={props.match}
                                    key={props.match.url}
                                    history={props.history}
                                    id={this.state.id}
                                />
                            )}
                        /> */}

                        <Route
                            exact
                            path="/logout"
                            render={() => <Welcome />}
                        />
                        {/* <Route
                            exact
                            path="/message"
                            render={() => <PrivateMessages />}
                        /> */}
                    </div>
                </BrowserRouter>
            </>
        );
    }
}
