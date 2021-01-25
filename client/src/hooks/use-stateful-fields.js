import { useState } from "react";

export default function useStatefulFields() {
    const [fields, setFields] = useState({});

    const handleChange = ({ target }) => {
        setFields({
            ...fields,
            [target.name]: target.value,
        });
    };

    return [fields, handleChange];
}
