import { combineReducers } from "redux";
import { friendsReducer } from "./friends/slice";
import { chatMessagesReducer } from "./chatMessages/slice";
import { groupMessagesReducer } from "./groupMessages/slice";

const rootReducer = combineReducers({
    //
    // Friends
    //
    friends: friendsReducer,
    //
    chatMessages: chatMessagesReducer,
    groupMessages: groupMessagesReducer,
    //
});

export default rootReducer;
