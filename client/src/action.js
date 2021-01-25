import axios from "./axios";

export async function getItems() {
    const { data } = await axios.get("/get-items");
    console.log("data", data);
    return {
        type: "ALL_ITEMS",
        items: data,
    };
}

export async function unavailable(id) {
    const { data } = await axios.post("/make-unavailable", id);
    console.log("data", data);
    if (data.success) {
        return {
            type: "UNAVAILABLE",
            id: id,
        };
    }
}

export async function available(id) {
    const { data } = await axios.post("/make-available", id);
    console.log("data", data);
    if (data.success) {
        return {
            type: "AVAILABLE",
            id: id,
        };
    }
}
export async function remove(id) {
    const { data } = await axios.post("/remove-item", id);
    console.log("data", data);
    if (data.success) {
        return {
            type: "REMOVE",
            id: id,
        };
    }
}
export async function returned(id) {
    const { data } = await axios.post("/return-item", id);
    console.log("data", data);
    if (data.success) {
        return {
            type: "RETURN",
            id: id,
        };
    }
}
