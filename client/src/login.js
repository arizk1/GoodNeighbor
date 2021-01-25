import { Link } from "react-router-dom";
import useStatefulFields from "./hooks/use-stateful-fields.js";
import useAuthSubmit from "./hooks/use-auth-submit.js";

export default function Login() {
    const [values, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit("/login", values);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div>
            {error && <p>Something is wrong! Please check your input</p>}
            <h2>Sign in</h2>
            <ul className="form1">
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
                        onClick={() => handleSubmit()}
                        type="submit"
                        value="SIGN IN"
                    />
                </li>

                <h4>
                    <Link to="/reset-password">Forgot your password?</Link>
                </h4>
            </ul>
        </div>
    );
}
