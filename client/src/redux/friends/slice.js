// Reducer
export function friendsReducer(friends = null, action) {
    if (action.type === "friends/set") {
        // Make Action
        // console.log("friends/set", action.payload);
        friends = action.payload;
    } else if (action.type === "friends/accept") {
        // Make Action
        let newFriends = friends.filter((friend) => {
            if (
                friend.senderid === action.payload.senderid &&
                friend.receiverid === action.payload.receiverid
            ) {
                console.log("Take out 1");
            } else if (
                friend.senderid === action.payload.receiverid &&
                friend.receiverid === action.payload.senderid
            ) {
                console.log("Take out 2");
            } else {
                return friend;
            }
        });
        newFriends.push({
            ...action.payload,
            accepted: true,
        });
        return newFriends;
    } else if (action.type === "friends/reject") {
        // Make Action
        console.log("Reject");
        console.log(friends);
        console.log(action.payload);
        const newFriends = friends.filter((friend) => {
            if (
                friend.senderid === action.payload.senderid &&
                friend.receiverid === action.payload.receiverid
            ) {
                console.log("Take out 1");
            } else if (
                friend.senderid === action.payload.receiverid &&
                friend.receiverid === action.payload.senderid
            ) {
                console.log("Take out 2");
            } else {
                return friend;
            }
        });
        console.log("newFriends :>> ", newFriends);
        return newFriends;
    }
    return friends;
}
//

// Action Creater
export function setFriends(friends) {
    return {
        type: "friends/set",
        payload: friends,
    };
}
export function acceptFriend(friend) {
    return {
        type: "friends/accept",
        payload: friend,
    };
}
export function rejectFriend(friend) {
    return {
        type: "friends/reject",
        payload: friend,
    };
}
//
