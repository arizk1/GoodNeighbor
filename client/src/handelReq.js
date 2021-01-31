import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRequests, acceptReq, rejectReq } from "./action";
import { Link } from "react-router-dom";
// import DatePicker from "react-date-picker";

export default function BorrowReq({ userId }) {
    // const userId = props.id;
    const [values, setValues] = useState({
        date: null,
        toggleAcceptData: false,
    });

    const dispatch = useDispatch();
    const comingRequests = useSelector(
        (state) =>
            state.requests &&
            state.requests.filter(
                (req) => req.owner_id === userId && req.accepted === false
            )
    );

    const sentRequests = useSelector(
        (state) =>
            state.requests &&
            state.requests.filter((req) => req.borwer_id === userId)
    );

    useEffect(() => {
        dispatch(getRequests());
    }, []);

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const handelAccept = () => {
        setValues({
            ...values,
            toggleAcceptData: !values.toggleAcceptData,
        });
    };

    if (!comingRequests) {
        return null;
    }
    return (
        <>
            <div className="coming-requests">
                <h1>Borrow Requests</h1>
                {comingRequests.length && (
                    <div>
                        <div className="items-container">
                            {comingRequests.map((item) => (
                                <div key={item.item_id} className="items-card">
                                    {/* <div className="items-pic">
                                        {item.url && <img src={item.url} />}
                                        {!item.url && item.type == "book" && (
                                            <img src="./book.png" />
                                        )}
                                        {!item.url && item.type == "tool" && (
                                            <img src="./tools.png" />
                                        )}

                                        {!item.url &&
                                            item.type == "equipment" && (
                                                <img src="./eqip.png" />
                                            )}
                                    </div>
                                    <div className="item-data">
                                        <h3>#{item.type}</h3>
                                        <h2>{item.title}</h2>
                                    </div> */}

                                    <div className="edit-buttons">
                                        <button
                                            id="accept"
                                            onClick={handelAccept}
                                        >
                                            Accept Request
                                        </button>

                                        {values.toggleAcceptData && (
                                            <>
                                                <ul className="form1">
                                                    <li>
                                                        <label>
                                                            Deadline to return
                                                            it back
                                                        </label>

                                                        <input
                                                            onChange={(e) =>
                                                                handleChange(e)
                                                            }
                                                            type="date"
                                                            name="until"
                                                            className="field-long"
                                                            // placeholder=""
                                                        />

                                                        {/* <DatePicker
                                                            onChange={onChange}
                                                            value={value}
                                                        /> */}
                                                    </li>
                                                    <li>
                                                        <input
                                                            onClick={() =>
                                                                dispatch(
                                                                    acceptReq(
                                                                        item.item_id,
                                                                        item.borwer_id,
                                                                        values
                                                                    )
                                                                )
                                                            }
                                                            type="submit"
                                                            value="Accept"
                                                        />
                                                    </li>
                                                </ul>
                                            </>
                                        )}

                                        {/* <button
                                            id="accept"
                                            onClick={() =>
                                                dispatch(acceptReq(req.id))
                                            }
                                        >
                                            Accept Request
                                        </button> */}
                                        <button
                                            id="remove"
                                            onClick={() =>
                                                dispatch(
                                                    rejectReq(item.item_id)
                                                )
                                            }
                                        >
                                            Rejet request
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {!comingRequests.length && (
                    <div>
                        <p>There is no any request yet.</p>
                    </div>
                )}
            </div>
        </>
    );
}
