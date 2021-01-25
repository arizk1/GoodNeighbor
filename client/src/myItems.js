import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItems, unavailable, available, returned, remove } from "./action";
import { Link } from "react-router-dom";

export default function MyItems(props) {
    const userId = props.id;
    const dispatch = useDispatch();
    const myItems = useSelector(
        (state) =>
            state.items &&
            state.items.filter(
                (item) => item.available && item.user_id === userId
            )
    );

    const unavailableItems = useSelector(
        (state) =>
            state.items &&
            state.items.filter(
                (item) => !item.available && item.user_id === userId
            )
    );
    const borrowedItems = useSelector(
        (state) =>
            state.items &&
            state.items.filter((item) => item.recipient_id === userId)
    );

    useEffect(() => {
        dispatch(getItems());
        console.log("props", props.id);
    }, []);

    if (!myItems) {
        return null;
    }
    return (
        <>
            <div className="my Items">
                <h1>My Items</h1>
                {myItems.length && (
                    <div>
                        <div className="items-container">
                            {myItems.map((item) => (
                                <div key={item.id} className="card">
                                    {/* <Link to={`/user/${user.id}`}> */}
                                    <img src={item.url} />
                                    {/* </Link> */}
                                    {/* <Link to={`/user/${user.id}`}> */}
                                    <h2>
                                        {item.type} {item.title}
                                    </h2>
                                    {/* </Link> */}
                                    <div className="edit-buttons">
                                        <button
                                            id="unavailable"
                                            onClick={() =>
                                                dispatch(unavailable(item.id))
                                            }
                                        >
                                            Make Unavailable
                                        </button>
                                        <button
                                            id="remove"
                                            onClick={() =>
                                                dispatch(remove(item.id))
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {!myItems.length && (
                    <div>
                        <h1>
                            There is no any item yet. Add item, be a
                            goodNeighbor
                        </h1>
                    </div>
                )}
            </div>
            <div className="unavailable-items">
                <h1>My Unavailable Items</h1>
                {unavailableItems.length && (
                    <div>
                        <div className="items-container">
                            {unavailableItems.map((item) => (
                                <div key={item.id} className="card">
                                    {/* <Link to={`/user/${user.id}`}> */}
                                    <img src={item.url} />
                                    {/* </Link> */}
                                    {/* <Link to={`/user/${user.id}`}> */}
                                    <h2>
                                        {item.type} {item.title}
                                    </h2>
                                    {/* </Link> */}
                                    <div className="edit-buttons">
                                        <button
                                            id="available"
                                            onClick={() =>
                                                dispatch(available(item.id))
                                            }
                                        >
                                            Make Available
                                        </button>
                                        <button
                                            id="remove"
                                            onClick={() =>
                                                dispatch(remove(item.id))
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {!unavailableItems.length && (
                    <div>
                        <h1>All your items are available</h1>
                    </div>
                )}
            </div>
            <div className="borrowed-items">
                <h1>Borrowed Items </h1>
                {borrowedItems.length >= 0 && (
                    <div>
                        <div className="items-container">
                            {borrowedItems.map((item) => (
                                <div key={item.id} className="card">
                                    {/* <Link to={`/user/${user.id}`}> */}
                                    <img src={item.url} />
                                    {/* </Link> */}
                                    {/* <Link to={`/user/${user.id}`}> */}
                                    <h2>
                                        {item.type} {item.title}
                                    </h2>
                                    <h2>{item.until}</h2>
                                    {/* </Link> */}
                                    <div className="edit-buttons">
                                        <button
                                            id="unavilable"
                                            onClick={() =>
                                                dispatch(returned(item.id))
                                            }
                                        >
                                            Return
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {!borrowedItems.length && (
                    <div>
                        <h4>
                            There are so many stuff out there, go borrow some!
                        </h4>
                    </div>
                )}
            </div>
        </>
    );
}
