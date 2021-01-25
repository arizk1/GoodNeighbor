import { useEffect, useRef, useState } from "react";
import axios from "./axios.js";
import SimpleMap from "./map.js";
// require("dotenv").config();

export default function GoogleMap({ postal_code, house_number, street, city }) {
    const googleMapRef = useRef();
    const [location, setLocation] = useState(true);

    useEffect(() => {
        if (location) {
            axios
                .get(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${postal_code}+${house_number}+${street},
        +${city},+CA&key=AIzaSyC7IIpKum64FkifUisD1XthrpAADpamFIU`
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
                            console.log(data);
                            if (data.success) {
                                setLocation(false);
                            }
                        });
                });
        }
    }, []);

    return (
        <>
            <h1>google</h1>
            <SimpleMap />
        </>
    );
}
