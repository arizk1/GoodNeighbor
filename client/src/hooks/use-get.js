import { useState } from "react";
import axios from "../axios.js";

export default function useGet(url) {
    const [error, setError] = useState(false);

    const get = async () => {
        try {
            const { data } = await axios.get(url);

            data.success ? location.replace("/account") : setError(true);
        } catch (err) {
            setError(true);
        }
    };

    return [error, get];
}
