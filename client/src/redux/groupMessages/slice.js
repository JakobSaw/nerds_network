// Reducer
export function groupMessagesReducer(groupMessages = null, action) {
    if (action.type === "groupMessagesReceived") {
        // console.log("action: groupMessagesReceived", action.payload);
        groupMessages = action.payload;
    } else if (action.type === "groupMessageReceived") {
        /* console.log("action: groupMessageReceived", [
            action.payload,
            ...groupMessages,
        ]); */
        return [action.payload, ...groupMessages];
    }
    return groupMessages;
}
//

// Action Creater
export function groupMessagesReceived(groupMessages) {
    return {
        type: "groupMessagesReceived",
        payload: groupMessages,
    };
}
export function groupMessageReceived(groupMessage) {
    return {
        type: "groupMessageReceived",
        payload: groupMessage,
    };
}
//
