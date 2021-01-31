import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItems, unavailable, available, returned, remove } from "./action";
import { Link } from "react-router-dom";

export default function MyItems({ userId }) {
    // const userId = props.id;
    const dispatch = useDispatch();
    const myItems = useSelector(
        (state) =>
            state.items &&
            state.items.filter(
                (item) => item.available == true && item.user_id === userId
            )
    );

    const unavailableItems = useSelector(
        (state) =>
            state.items &&
            state.items.filter(
                (item) => item.available == false && item.user_id === userId
            )
    );
    const borrowedItems = useSelector(
        (state) =>
            state.items &&
            state.items.filter((item) => item.recipient_id === userId)
    );

    useEffect(() => {
        dispatch(getItems());
    }, []);

    if (!myItems) {
        return null;
    }
    return (
        <>
            <div className="my-Items">
                <h1>Items Manager</h1>
                <p>
                    You can easily track where are your items, <br />{" "}
                    temporarily make them unavailable or remove them permanently
                </p>

                {myItems.length && (
                    <div>
                        <h3>My Available Items</h3>
                        <div className="items-container">
                            {myItems.map((item) => (
                                <div key={item.id} className="items-card">
                                    <div className="items-pic">
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
                                    </div>
                                    <div className="edit-buttons">
                                        <button
                                            id="available"
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
                        <p>
                            There is no any available item. Add some and be a
                            goodNeighbor ♥️
                        </p>
                    </div>
                )}
            </div>
            <div className="unavailable-items">
                <h3>My Unavailable Items</h3>
                {unavailableItems.length && (
                    <div>
                        <div className="items-container">
                            {unavailableItems.map((item) => (
                                <div key={item.id} className="items-card">
                                    <div className="items-pic">
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
                                    </div>
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
                        <p>All your items are available.</p>
                    </div>
                )}
            </div>
            <div className="borrowed-items">
                <h3>My Borrowed Items </h3>
                {borrowedItems.length && (
                    <div>
                        <div className="items-container">
                            {borrowedItems.map((item) => (
                                <div key={item.id} className="items-card">
                                    <div className="items-pic">
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
                                        <h2>{item.until}</h2>
                                    </div>

                                    <div className="edit-buttons">
                                        <button
                                            id="available"
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
                        <p>
                            There are so many stuff out there, go borrow some 🤓
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
