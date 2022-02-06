import { io } from "socket.io-client";
import {
    chatMessagesReceived,
    chatMessageReceived,
} from "../redux/chatMessages/slice";
import {
    groupMessagesReceived,
    groupMessageReceived,
} from "../redux/groupMessages/slice";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) =>
            store.dispatch(chatMessagesReceived(msgs))
        );
        socket.on("groupMessages", (msgs) =>
            store.dispatch(groupMessagesReceived(msgs))
        );

        socket.on("newChatMessage", (msg) => {
            console.log("Store Dispatch chatMessageReceived");
            store.dispatch(chatMessageReceived(msg));
        });
        socket.on("newGroupMessage", (msg) => {
            console.log("Store Dispatch groupMessageReceived");
            store.dispatch(groupMessageReceived(msg));
        });
    }
};
