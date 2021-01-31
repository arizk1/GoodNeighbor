export default function (state = {}, action) {
    if (action.type == "ALL_ITEMS") {
        state = {
            ...state,
            items: action.items,
        };
    }

    if (action.type == "UNAVAILABLE") {
        state = {
            ...state,
            items: state.items.map((item) => {
                if (item.id == action.itemId) {
                    return {
                        ...item,
                        available: false,
                    };
                } else {
                    return item;
                }
            }),
        };
    }
    if (action.type == "AVAILABLE") {
        state = {
            ...state,
            items: state.items.map((item) => {
                if (item.id == action.itemId) {
                    return {
                        ...item,
                        available: true,
                    };
                } else {
                    return item;
                }
            }),
        };
    }

    if (action.type == "REMOVE") {
        state = {
            ...state,
            items: state.items.map((item) => {
                if (item.id == action.itemId) {
                    return {
                        ...item,
                        available: null,
                    };
                } else {
                    return item;
                }
            }),
        };
    }

    if (action.type == "ALL_REQS") {
        state = {
            ...state,
            requests: action.requests,
        };
    }

    if (action.type == "ACCEPT_REQ") {
        state = {
            ...state,
            requests: state.requests.map((req) => {
                if (req.item_id == action.itemId) {
                    return {
                        ...req,
                        accepted: true,
                    };
                } else {
                    return req;
                }
            }),
        };
    }
    if (action.type == "REJECT_REQ") {
        state = {
            ...state,
            requests: state.requests.map((req) => {
                if (req.item_id == action.itemId) {
                    return {
                        ...req,
                        accepted: null,
                    };
                } else {
                    return req;
                }
            }),
        };
    }

    if (action.type == "GET_RECENT_ITEMS") {
        state = {
            ...state,
            recent: action.recentItems,
        };
        console.log(state);
    }

    if (action.type == "GET_ITEMS_FOR") {
        state = {
            ...state,
            search: action.searchItems,
        };
    }

    return state;
}
