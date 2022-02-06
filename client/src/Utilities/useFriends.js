import FetchReq from "./FetchReq";
import { useDispatch } from "react-redux";
import { acceptFriend, rejectFriend } from "../redux/friends/slice";

function useFriends() {
    const dispatch = useDispatch();

    const accept = async (friend) => {
        const data = await FetchReq(
            false,
            `/add/friend?senderid=${friend.senderid}&receiverid=${friend.receiverid}`
        );
        if (data) {
            const action = acceptFriend(friend);
            dispatch(action);
            location.reload();
        }
    };

    const deleteFriend = async (friend) => {
        const data = await FetchReq(
            false,
            `/delete?senderid=${friend.senderid}&receiverid=${friend.receiverid}`
        );
        if (data) {
            const action = rejectFriend(friend);
            dispatch(action);
            location.reload();
        }
    };

    return [accept, deleteFriend];
}

export default useFriends;
