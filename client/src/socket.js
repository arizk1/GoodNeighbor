import io from "socket.io-client";

// import { } from "./action";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }
    // socket.on("new chat msg and user", (userAndMessage) => {
    //     console.log(userAndMessage);
    //     store.dispatch(postNewMessage(userAndMessage));
    // });
    // socket.on("10 recent messages", (recentTenMessages) => {
    //     console.log(recentTenMessages);
    //     store.dispatch(getRecentTenMessages(recentTenMessages));
    // });
    // socket.on("onlineUsers", (onlineUsers) => {
    //     console.log(onlineUsers);
    //     store.dispatch(getOnlineUsers(onlineUsers));
    // });
    // socket.on("listOfFriends", (privateList) => {
    //     console.log(privateList);
    //     store.dispatch(getFriendsPrivateMessages(privateList));
    // });
};
