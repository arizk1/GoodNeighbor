import { Link } from "react-router-dom";
import useStatefulFields from "./hooks/use-stateful-fields.js";
import useAuthSubmit from "./hooks/use-auth-submit.js";

export default function Registration() {
    const [values, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit("/register", values);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div>
            {error && <p>Something is wrong! Please check your input</p>}

            <h2>Create Account</h2>
            <ul className="form1">
                <li>
                    <label>
                        Full Name <span className="required">*</span>
                    </label>
                    <input
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="first"
                        className="field-divided"
                        placeholder="First name"
                    />
                    <input
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="last"
                        className="field-divided"
                        placeholder="Last name"
                    />
                </li>
                <li>
                    <label>
                        Email <span className="required">*</span>
                    </label>
                    <input
                        onChange={(e) => handleChange(e)}
                        type="email"
                        name="email"
                        className="field-long"
                        placeholder="example@example.com"
                    />
                </li>
                <li>
                    <label>
                        Password <span className="required">*</span>
                    </label>
                    <input
                        onChange={(e) => handleChange(e)}
                        onKeyPress={(e) => handleKeyPress(e)}
                        className="password"
                        type="password"
                        name="password"
                        placeholder="p@$$W0rd"
                    />
                </li>
                <li>
                    <input
                        onClick={(e) => handleSubmit(e)}
                        type="submit"
                        value="SIGN UP"
                    />
                    <div className="loginbutton">
                        <h4>
                            {" "}
                            Have already an account?{" "}
                            <Link to="/login">Login here!</Link>
                        </h4>
                    </div>
                </li>
            </ul>
        </div>
    );
}
