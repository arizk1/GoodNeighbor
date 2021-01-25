import { NormalModule } from "webpack";

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
                if (item.id == action.id) {
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
                if (item.id == action.id) {
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
                if (item.id == action.id) {
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
    return state;
}
