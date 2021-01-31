import { useEffect, useState } from "react";
import axios from "./axios";

export default function Borrowbtn({ itemId }) {
    const [buttonText, setButtonText] = useState();

    useEffect(() => {
        let abort;
        (async () => {
            if (itemId) {
                const { data } = await axios.get(`/request-status/${itemId}`);

                if (!abort) {
                    console.log("data from /request-status   ", data);
                    setButtonText(data);
                }
            }
        })();
        return () => {
            abort = true;
        };
    }, [itemId]);

    const handelClick = () => {
        axios
            .post(`/update/request-status`, {
                action: buttonText,
                itemId: itemId,
            })
            .then(({ data }) => {
                console.log("data  ", data);
                setButtonText(data);
            });
    };

    return (
        <section>
            <button className="borrow-button" onClick={handelClick}>
                {buttonText}
            </button>
        </section>
    );
}
