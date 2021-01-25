import axios from "./axios";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ResetPassword() {
    const [data, setData] = useState({});
    const [view, setViews] = useState(1);
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        setData({
            [e.target.name]: e.target.value,
        });
    };

    const handleEmailCheck = (e) => {
        axios
            .post("/password/reset/start", data)
            .then(({ data }) => {
                setData(data);
                setViews(2);
            })
            .catch((error) => {
                setViews({ error: true });
                console.log("error: ", error);
            });
    };

    const handleSubmit = (e) => {
        console.log("working");

        axios
            .post("/password/reset/verify", data)
            .then((data) => {
                setData(data);
                setViews(3);
            })
            .catch((error) => {
                setError({ error: true });
                console.log("error: ", error);
            });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <>
            <div>
                {error && <p>Something is wrong! Please check your input</p>}
                <h2>Reset your password</h2>

                {view == 1 && (
                    <div>
                        <ul className="form1">
                            <h4>
                                Please enter the email address with which you
                                registered.
                            </h4>
                            <li>
                                <label>
                                    Email <span className="required">*</span>
                                </label>
                                <input
                                    onChange={(e) => handleChange(e)}
                                    onKeyPress={(e) => handleKeyPress(e)}
                                    type="email"
                                    name="email"
                                    className="field-long"
                                    placeholder="example@example.com"
                                />
                            </li>
                            <li>
                                <input
                                    onClick={(e) => handleEmailCheck(e)}
                                    type="submit"
                                    value="Submit"
                                />
                            </li>
                        </ul>
                    </div>
                )}
                {view == 2 && (
                    <div>
                        <ul className="form1">
                            <h4>
                                Please enter the code you recieved on your email
                            </h4>
                            <li>
                                <input
                                    onChange={(e) => handleChange(e)}
                                    type="text"
                                    name="code"
                                    className="field-long"
                                    placeholder="code"
                                />
                            </li>
                            <h3>Please enter your new password</h3>
                            <li>
                                <input
                                    onChange={(e) => handleChange(e)}
                                    onKeyPress={(e) => handleKeyPress(e)}
                                    className="password"
                                    type="password"
                                    name="password"
                                    placeholder="new password"
                                />
                            </li>
                            <li>
                                <input
                                    onClick={(e) => handleSubmit(e)}
                                    type="submit"
                                    value="Submit"
                                />
                            </li>
                        </ul>
                    </div>
                )}
                {view == 3 && (
                    <div>
                        <h1>Success!</h1>

                        <div>
                            <h4>
                                {" "}
                                You can now <Link to="/login">login</Link> with
                                your new password!
                            </h4>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
