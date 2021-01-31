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
    const { data } = await axios.post("/make-unavailable", { itemId: id });
    console.log("data", data);
    if (data.success) {
        return {
            type: "UNAVAILABLE",
            itemId: id,
        };
    }
}

export async function available(id) {
    const { data } = await axios.post("/make-available", { itemId: id });
    console.log("data", data);
    if (data.success) {
        return {
            type: "AVAILABLE",
            itemId: id,
        };
    }
}
export async function remove(id) {
    const { data } = await axios.post("/remove-item", { itemId: id });
    console.log("data", data);
    if (data.success) {
        return {
            type: "REMOVE",
            itemId: id,
        };
    }
}
export async function returned(id) {
    const { data } = await axios.post("/return-item", { itemId: id });
    console.log("data", data);
    if (data.success) {
        return {
            type: "RETURN",
            itemId: id,
        };
    }
}

export async function getRequests() {
    const { data } = await axios.get("/borrow-requests");
    console.log("data", data);
    return {
        type: "ALL_REQS",
        requests: data,
    };
}
export async function acceptReq(itemId, borwerId, values) {
    const { data } = await axios.post("/accept-req", {
        itemId: itemId,
        borwerId: borwerId,
        val: values,
    });
    console.log("data", data);
    if (data.success) {
        return {
            type: "ACCEPT_REQ",
            itemId: itemId,
        };
    }
}
export async function rejectReq(id) {
    const { data } = await axios.post("/reject-req", { itemId: id });
    console.log("data", data);
    if (data.success) {
        return {
            type: "REJECT_REQ",
            itemId: id,
        };
    }
}

export async function getRecentItems() {
    const { data } = await axios.get(`/find/recent/items`);
    console.log("data", data);
    if (data.success) {
        return {
            type: "GET_RECENT_ITEMS",
            recentItems: data,
        };
    }
}

export async function getItemsFor(query) {
    const { data } = await axios.get(`/find/items/:${query}`);
    console.log("data", data);
    if (data.success) {
        return {
            type: "GET_ITEMS_FOR",
            searchItems: data,
        };
    }
}
