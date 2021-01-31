import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthSubmit from "./hooks/use-auth-submit.js";
import ProfilePic from "./profilepic.js";
import BioEditor from "./bioEditor";
import useGet from "./hooks/use-get";
import GoogleMap from "./google.js";
import axios from "./axios";

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
        postal_code: null,
        house_number: null,
        street: null,
        city: null,
    });
    const [adressError, setAdressError] = useState(false);
    const [values, setValues] = useState({
        first: first,
        last: last,
        email: email,
        postal_code: postal_code,
        house_number: house_number,
        street: street,
        city: city,
        deleteAcc: false,
    });
    const handleAddressChange = (e) => {
        setAddressvalues({
            ...addressvalues,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddressSubmit = async () => {
        const { data } = await axios.post("/user/address", {
            ...addressvalues,
        });
        data.success ? location.replace("/account") : setAdressError(true);
    };

    const [error, handleSubmit] = useAuthSubmit("/user/account/edit", {
        ...values,
    });

    const [confirmDelete, setDelete] = useState(false);

    useEffect(() => {
        if (values.postal_code) {
            axios
                .get(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${postal_code}+${house_number}+${street}
            +${city}+CA&key=AIzaSyC7IIpKum64FkifUisD1XthrpAADpamFIU`
                )
                .then(({ data }) => {
                    const lat = data.results[0].geometry.location.lat;
                    const lng = data.results[0].geometry.location.lng;
                    const placeId = data.results[0].place_id;
                    axios
                        .post("/user-location", {
                            lat: lat,
                            lng: lng,
                            placeId: placeId,
                        })
                        .then(({ data }) => {
                            if (data.success) {
                                console.log(data);
                            }
                        });
                });

            // navigator.geolocation.getCurrentPosition(function (position) {
            //     console.log("Latitude is :", position.coords.latitude);
            //     console.log("Longitude is :", position.coords.longitude);
            //     const lat = position.coords.latitude;
            //     const lng = position.coords.longitude;

            //     axios
            //         .post("/user-location", {
            //             lat: lat,
            //             lng: lng,
            //             placeId: "placeId",
            //         })
            //         .then(({ data }) => {
            //             if (data.success) {
            //                 console.log(data);
            //             }
            //         });
            // });
        }
    }, [values.postal_code]);
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
                    <h2>Confirm Deletion</h2>
                    {/* <button className="close-button" onClick={toggleDelete}>
                        X
                    </button> */}
                </div>
                <button
                    id="delete"
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
                {profile_pic && (
                    <div className="img-del">
                        <button onClick={get}>Delete profile pic</button>
                    </div>
                )}

                <div className="profile-name">
                    <h2>
                        {first} {last}
                    </h2>

                    <BioEditor bio={bio} addBio={addBio} />
                </div>
            </section>

            {confirmDelete && confirmModal}

            <h1 className="title">Account Settings</h1>
            <section className="account-data">
                {!values.postal_code && !values.city && (
                    <>
                        {adressError && (
                            <p className="error-message">
                                Something went wrong...
                            </p>
                        )}

                        <p>
                            Add your profile data and address to be able to use
                            the our features
                        </p>
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
                                        handleAddressSubmit(handelView)
                                    }
                                    type="submit"
                                    value="Save"
                                />
                            </li>
                        </ul>
                    </>
                )}

                {values.postal_code && view === 2 && (
                    <>
                        {/* <GoogleMap
                        postal_code={addressvalues.postal_code}
                        house_number={addressvalues.house_number}
                        street={addressvalues.street}
                        city={addressvalues.city}
                    /> */}
                        {error && (
                            <p className="error-message">
                                Something went wrong...
                            </p>
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
                                    value={values.postal_code}
                                    readOnly
                                />
                            </li>
                            <li>
                                <label>Address</label>
                                <input
                                    type="number"
                                    name="house_number"
                                    className="field-divided"
                                    value={values.house_number}
                                    readOnly
                                />
                                <input
                                    type="text"
                                    name="street"
                                    className="field-divided"
                                    value={values.street}
                                    readOnly
                                />
                            </li>
                            <li>
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={values.city}
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
                            <p className="error-message">
                                Something went wrong...
                            </p>
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
                                    value={values.postal_code}
                                />
                            </li>
                            <li>
                                <label>Address</label>
                                <input
                                    onChange={(e) => handleChange(e)}
                                    type="number"
                                    name="house_number"
                                    className="field-divided"
                                    value={values.house_number}
                                />
                                <input
                                    onChange={(e) => handleChange(e)}
                                    onKeyPress={(e) => handleKeyPress(e)}
                                    type="text"
                                    name="street"
                                    className="field-divided"
                                    value={values.street}
                                />
                            </li>
                            <li>
                                <label>City</label>
                                <input
                                    onChange={(e) => handleChange(e)}
                                    onKeyPress={(e) => handleKeyPress(e)}
                                    type="text"
                                    name="city"
                                    value={values.city}
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
                                <Link to="/">
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
            </section>
        </>
    );
}
