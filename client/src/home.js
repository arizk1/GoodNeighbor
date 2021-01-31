import { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SearchFor from "./search";

export default function Home(props) {
    return (
        <>
            <SearchFor />
        </>
    );
}

// <div
//     className="berlin"
//     style={{
//         backgroundImage: "url(/hoppa.png)",
//         objectFit: "cover",

//         backgroundRepeat: "no-repeat",
//         zIndex: 1,
//     }}
// ></div>;
