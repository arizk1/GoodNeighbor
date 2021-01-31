import React, { Component } from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function SimpleMap() {
    const defaultProps = {
        center: {
            lat: 52.5,
            lng: 13.34,
        },
        zoom: 11,
    };

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: "30vh", width: "30%" }}>
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: "AIzaSyC7IIpKum64FkifUisD1XthrpAADpamFIU",
                }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
            >
                {/* <AnyReactComponent
                    lat={52.50573}
                    lng={13.34786}
                    text="My Marker"
                /> */}
            </GoogleMapReact>
        </div>
    );
}
