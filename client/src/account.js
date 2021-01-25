import { Link } from "react-router-dom";
import { useState } from "react";
import useAuthSubmit from "./hooks/use-auth-submit.js";
import ProfilePic from "./profilepic.js";
import BioEditor from "./bioEditor";
import useGet from "./hooks/use-get";

export default function Account({
    first,
    last,
    email,
    postal_code,
    house_number,
    street,
    city,
    addBio,
    bio,
    toggleUploader,
    profile_pic,
}) {
    const [view, setView] = useState(2);

    const [addressvalues, setAddressvalues] = useState({
        postal_code: postal_code,
        house_number: house_number,
        street: street,
        city: city,
    });

    const handleAddressChange = (e) => {
        setAddressvalues({
            [e.target.name]: e.target.value,
        });
    };

    const [adressError, handleAddressSubmit] = useAuthSubmit(
        "/user/address",
        addressvalues
    );

    const [values, setValues] = useState({
        first: first,
        last: last,
        email: email,
        ostal_code: postal_code,
        house_number: house_number,
        street: street,
        city: city,
        deleteAcc: false,
    });
    const [error, handleSubmit] = useAuthSubmit("/user/account/edit", {
        ...values,
    });

    const [confirmDelete, setDelete] = useState(false);

    const toggleDelete = () => {
        setValues({
            ...values,
            deleteAcc: !values.deleteAcc,
        });
        setDelete(!confirmDelete);
    };

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const handleAddressKeyPress = (e) => {
        if (e.key === "Enter") {
            handleAddressSubmit();
        }
    };

    const handelView = () => {
        setView(2);
    };
    const handleEdit = () => {
        setView(3);
    };

    const [errorGet, get] = useGet("/user/delete/profile-pic");

    const confirmModal = (
        <div className="modal" onClick={toggleDelete}>
            <div className="modal-box">
                <div className="modal-header">
                    <h2>Confirm Account Deletion</h2>
                    <button className="close-button" onClick={toggleDelete}>
                        X
                    </button>
                </div>
                <button
                    className="welcome-button switch-button"
                    onClick={handleSubmit}
                >
                    Delete Account
                </button>
                <button
                    className="welcome-button submit-button"
                    onClick={toggleDelete}
                >
                    Cancel
                </button>
            </div>
        </div>
    );

    return (
        <>
            <section>
                <div className="profile-pic-container">
                    <ProfilePic
                        profile_pic={profile_pic}
                        toggleUploader={toggleUploader}
                    />
                </div>
                <button onClick={get}>Delete profile pic</button>
                <div className="profile-name">
                    <h2>
                        {first} {last}
                    </h2>

                    <BioEditor bio={bio} addBio={addBio} />
                </div>
            </section>

            {confirmDelete && confirmModal}
            <h2 className="title">Account Settings</h2>

            {!addressvalues && (
                <>
                    {adressError && (
                        <p className="error-message">Something went wrong...</p>
                    )}
                    <ul className="form1">
                        <li>
                            <label>Postal Code</label>
                            <input
                                onChange={(e) => handleAddressChange(e)}
                                type="number"
                                name="postal_code"
                                className="field-long"
                                // placeholder=""
                            />
                        </li>
                        <li>
                            <label>Address</label>
                            <input
                                onChange={(e) => handleAddressChange(e)}
                                type="number"
                                name="house_number"
                                className="field-divided"
                                placeholder="House No."
                            />
                            <input
                                onChange={(e) => handleAddressChange(e)}
                                type="text"
                                name="street"
                                className="field-divided"
                                placeholder="Street"
                            />
                        </li>
                        <li>
                            <label>City</label>
                            <input
                                onChange={(e) => handleAddressChange(e)}
                                onKeyPress={(e) => handleAddressKeyPress(e)}
                                className="field-divided"
                                type="text"
                                name="city"
                            />
                        </li>
                        <li>
                            <input
                                onClick={() =>
                                    handleAddressSubmit(handelView())
                                }
                                type="submit"
                                value="Save"
                            />
                        </li>
                    </ul>
                </>
            )}

            {addressvalues && view === 2 && (
                <>
                    {error && (
                        <p className="error-message">Something went wrong...</p>
                    )}

                    <ul className="form1">
                        <li>
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="first"
                                className="field-divided"
                                value={values.first}
                                readOnly
                            />
                            <input
                                type="text"
                                name="last"
                                className="field-divided"
                                value={values.last}
                                readOnly
                            />
                        </li>
                        <li>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                className="field-long"
                                value={values.email}
                                readOnly
                            />
                        </li>
                        <li>
                            <label>Postal Code</label>
                            <input
                                type="number"
                                name="postal_code"
                                className="field-long"
                                value={addressvalues.postal_code}
                                readOnly
                            />
                        </li>
                        <li>
                            <label>Address</label>
                            <input
                                type="number"
                                name="house_number"
                                className="field-divided"
                                value={addressvalues.house_number}
                                readOnly
                            />
                            <input
                                type="text"
                                name="street"
                                className="field-divided"
                                value={addressvalues.street}
                                readOnly
                            />
                        </li>
                        <li>
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={addressvalues.city}
                                readOnly
                            />
                        </li>
                        <li>
                            <input
                                onClick={(e) => handleEdit(e)}
                                type="submit"
                                value="Edit You Profile Data"
                            />
                        </li>
                    </ul>
                </>
            )}

            {view === 3 && (
                <div className="auth-container">
                    {error && (
                        <p className="error-message">Something went wrong...</p>
                    )}

                    <ul className="form1">
                        <li>
                            <label>Full Name</label>
                            <input
                                onChange={(e) => handleChange(e)}
                                type="text"
                                name="first"
                                className="field-divided"
                                value={values.first}
                            />
                            <input
                                onChange={(e) => handleChange(e)}
                                type="text"
                                name="last"
                                className="field-divided"
                                value={values.last}
                            />
                        </li>
                        <li>
                            <label>Email</label>
                            <input
                                onChange={(e) => handleChange(e)}
                                onKeyPress={(e) => handleKeyPress(e)}
                                type="email"
                                name="email"
                                className="field-long"
                                value={values.email}
                            />
                        </li>
                        <li>
                            <label>Password</label>
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
                            <label>Postal Code</label>
                            <input
                                onChange={(e) => handleChange(e)}
                                onKeyPress={(e) => handleKeyPress(e)}
                                type="number"
                                name="postal_code"
                                className="field-long"
                                value={addressvalues.postal_code}
                            />
                        </li>
                        <li>
                            <label>Address</label>
                            <input
                                onChange={(e) => handleChange(e)}
                                type="number"
                                name="house_number"
                                className="field-divided"
                                value={addressvalues.house_number}
                            />
                            <input
                                onChange={(e) => handleChange(e)}
                                onKeyPress={(e) => handleKeyPress(e)}
                                type="text"
                                name="street"
                                className="field-divided"
                                value={addressvalues.street}
                            />
                        </li>
                        <li>
                            <label>City</label>
                            <input
                                onChange={(e) => handleChange(e)}
                                onKeyPress={(e) => handleKeyPress(e)}
                                type="text"
                                name="city"
                                value={addressvalues.city}
                            />
                        </li>
                        <li>
                            <input
                                onClick={handleSubmit}
                                type="submit"
                                value="Submit Changes"
                            />
                        </li>
                        <li>
                            <Link to="/account">
                                <input type="submit" value="Cancel" />
                            </Link>
                        </li>
                        <li>
                            <input
                                onClick={toggleDelete}
                                type="submit"
                                value="Delete Account"
                            />
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
}
