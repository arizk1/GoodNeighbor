import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import Borrowbtn from "./borrowbtn";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => <div>📍{text}</div>;

export default function SearchFor() {
    const [query, setQuery] = useState("");
    const [searchedItems, setSearchedItems] = useState([]);
    const [recentItems, setRecentItems] = useState([]);

    // THIS MUST BE DINAMIC, ANOTHER GET REQUEST
    const defaultProps = {
        center: {
            lat: 52.5,
            lng: 13.34,
        },
        zoom: 11,
    };

    useEffect(() => {
        let abort;

        (async () => {
            const { data } = await axios.get(`/find/recent/items`);
            if (!abort) {
                setRecentItems(data);
            }
        })();

        (async () => {
            const { data } = await axios.get(`/find/items/:${query}`);
            if (!abort) {
                setSearchedItems(data);
            }
        })();

        return () => {
            abort = true;
        };
    }, [query]);

    return (
        <>
            <section>
                <h3 className="search-here">Search in your neignborhood</h3>

                <div className="wrapper">
                    <img
                        className="search-icon"
                        src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU2Ljk2NiA1Ni45NjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU2Ljk2NiA1Ni45NjY7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPHBhdGggZD0iTTU1LjE0Niw1MS44ODdMNDEuNTg4LDM3Ljc4NmMzLjQ4Ni00LjE0NCw1LjM5Ni05LjM1OCw1LjM5Ni0xNC43ODZjMC0xMi42ODItMTAuMzE4LTIzLTIzLTIzcy0yMywxMC4zMTgtMjMsMjMgIHMxMC4zMTgsMjMsMjMsMjNjNC43NjEsMCw5LjI5OC0xLjQzNiwxMy4xNzctNC4xNjJsMTMuNjYxLDE0LjIwOGMwLjU3MSwwLjU5MywxLjMzOSwwLjkyLDIuMTYyLDAuOTIgIGMwLjc3OSwwLDEuNTE4LTAuMjk3LDIuMDc5LTAuODM3QzU2LjI1NSw1NC45ODIsNTYuMjkzLDUzLjA4LDU1LjE0Niw1MS44ODd6IE0yMy45ODQsNmM5LjM3NCwwLDE3LDcuNjI2LDE3LDE3cy03LjYyNiwxNy0xNywxNyAgcy0xNy03LjYyNi0xNy0xN1MxNC42MSw2LDIzLjk4NCw2eiIgZmlsbD0iIzAwMDAwMCIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K"
                    />
                    <input
                        className="search"
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search here..."
                    />
                </div>

                <div className="search-results">
                    <div className="map">
                        <GoogleMapReact
                            bootstrapURLKeys={{
                                key: "AIzaSyC7IIpKum64FkifUisD1XthrpAADpamFIU",
                            }}
                            defaultCenter={defaultProps.center}
                            defaultZoom={defaultProps.zoom}
                        >
                            {query &&
                                searchedItems.map((all) => (
                                    <div key={all.id} className="card">
                                        <AnyReactComponent
                                            lat={all.lat}
                                            lng={all.lng}
                                            text={all.title}
                                        />
                                    </div>
                                ))}
                        </GoogleMapReact>
                    </div>
                </div>

                <div>
                    <>
                        <div className="results-container">
                            {query &&
                                searchedItems.map((all) => (
                                    <div key={all.id} className="results-card">
                                        <div className="search-pic">
                                            {all.url && <img src={all.url} />}
                                            {!all.url && all.type == "book" && (
                                                <img src="./book.png" />
                                            )}
                                            {!all.url && all.type == "tool" && (
                                                <img src="./tools.png" />
                                            )}

                                            {!all.url &&
                                                all.type == "equipment" && (
                                                    <img src="./eqip.png" />
                                                )}
                                        </div>
                                        <div className="results-data">
                                            <h3>#{all.type}</h3>
                                            <h2>{all.title}</h2>
                                            {all.description ? (
                                                <p>{all.description}</p>
                                            ) : (
                                                <p>No description provided! </p>
                                            )}
                                        </div>
                                        <div className="owner-container">
                                            <div className="owner-card">
                                                <div className="owner-pic">
                                                    {/* <h2>Listed by:</h2> */}
                                                    {all.profile_pic ? (
                                                        <img
                                                            src={
                                                                all.profile_pic
                                                            }
                                                        />
                                                    ) : (
                                                        <img src="/abstract-888.png" />
                                                    )}
                                                </div>

                                                <div className="owner-name">
                                                    <h5>
                                                        {" "}
                                                        {all.first} {all.last}
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="available">
                                            {all.available && (
                                                <>
                                                    <h4>🟢 Available</h4>
                                                    <div className="btn">
                                                        <Borrowbtn
                                                            itemId={all.id}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {!all.available && (
                                                <>
                                                    <h4>🔴 Unvailable</h4>
                                                    {all.until && (
                                                        <h4>
                                                            Available on{" "}
                                                            {all.until}
                                                        </h4>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            {!searchedItems && query && <p>Nothing Found</p>}
                        </div>
                    </>
                    <div className="results-container">
                        {!query &&
                            recentItems.map((all) => (
                                <div key={all.id} className="results-card">
                                    <div className="search-pic">
                                        {all.url && <img src={all.url} />}
                                        {!all.url && all.type == "book" && (
                                            <img src="./book.png" />
                                        )}
                                        {!all.url && all.type == "tool" && (
                                            <img src="./tools.png" />
                                        )}

                                        {!all.url &&
                                            all.type == "equipment" && (
                                                <img src="./eqip.png" />
                                            )}
                                    </div>
                                    <div className="results-data">
                                        <h3>#{all.type}</h3>
                                        <h2>{all.title}</h2>
                                        {all.description ? (
                                            <p>{all.description}</p>
                                        ) : (
                                            <p>No description provided! </p>
                                        )}
                                    </div>
                                    <div className="owner-container">
                                        <div className="owner-card">
                                            <div className="owner-pic">
                                                {/* <h2>Listed by:</h2> */}
                                                {all.profile_pic ? (
                                                    <img
                                                        src={all.profile_pic}
                                                    />
                                                ) : (
                                                    <img src="/abstract-888.png" />
                                                )}
                                            </div>

                                            <div className="owner-name">
                                                <h5>
                                                    {" "}
                                                    {all.first} {all.last}
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="available">
                                        {all.available && (
                                            <>
                                                <h4>🟢 Available</h4>
                                                <div className="btn">
                                                    <Borrowbtn
                                                        itemId={all.id}
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {!all.available && (
                                            <>
                                                <h4>🔴 Unvailable</h4>
                                                {all.until && (
                                                    <h4>
                                                        Available on {all.until}
                                                    </h4>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </section>
        </>
    );
}
