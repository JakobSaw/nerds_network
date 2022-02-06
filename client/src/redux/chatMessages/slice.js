// Reducer
export function chatMessagesReducer(chatMessages = null, action) {
    if (action.type === "chatMessagesReceived") {
        // console.log("action: chatMessagesReceived", action.payload);
        chatMessages = action.payload;
    } else if (action.type === "chatMessageReceived") {
        console.log("action: chatMessageReceived");
        // console.log("New Messages", [...chatMessages, action.payload]);
        return [action.payload, ...chatMessages];
    }
    return chatMessages;
}
//

// Action Creater
export function chatMessagesReceived(chatMessages) {
    return {
        type: "chatMessagesReceived",
        payload: chatMessages,
    };
}
export function chatMessageReceived(chatMessage) {
    return {
        type: "chatMessageReceived",
        payload: chatMessage,
    };
}
//
