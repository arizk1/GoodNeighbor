import { useState } from "react";
import axios from "../axios.js";

export default function useAuthSubmit(url, fields) {
    const [error, setError] = useState(false);

    const submit = async () => {
        try {
            const { data } = await axios.post(url, fields);

            data.success ? location.replace("/account") : setError(true);
        } catch (err) {
            setError(true);
        }
    };

    return [error, submit];
}
