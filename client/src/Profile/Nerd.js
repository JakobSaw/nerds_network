import { useEffect, useState, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Friend from "./Friend";
import Me from "./Me";
import Renderprofile from "./Renderprofile";
import Logo_Full from "../assets/Full_Logo.svg";
import Chat from "../assets/Chat.svg";
import MainContext from "../context/MainContext";
import FetchReq from "../Utilities/FetchReq";
import useFriends from "../Utilities/useFriends";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setFriends } from "../redux/friends/slice";
//

// Socket
import { socket } from "../Utilities/socket";
//

const Nerd = () => {
    //

    // State & Hooks
    const { mainState } = useContext(MainContext);
    const [nav, setNav] = useState("profile");
    const profileNavRef = useRef();
    const textareaRef = useRef();
    const [nerd, setNerd] = useState({
        isFriend: false,
        isRequested: false,
        requestedMe: false,
        userprofile: {},
        friends: [],
    });
    const [accept, deleteFriend] = useFriends();
    const dispatch = useDispatch();
    //
    const { userid: nerdId, name: nerdName } = useParams();
    useEffect(() => {
        console.log("UseEffect Nerd.js");
        const getProfile = async () => {
            /* const nerdId = new URLSearchParams(props.location.search).get(
                "userid"
            );
            const nerdName = new URLSearchParams(props.location.search).get(
                "name"
            ); */
            const data = await FetchReq(
                false,
                `/get/nerdprofile?userid=${nerdId}`
            );
            if (data) {
                // Get Friends
                const getFriends = data.friends?.filter(
                    (element) =>
                        (element.senderid === nerdId ||
                            element.receiverid === nerdId) &&
                        element.accepted
                );
                //

                // Check for Friendship
                const checkForFriendship = data.friends?.filter(
                    (element) =>
                        (element.senderid === mainState.user.id ||
                            element.receiverid === mainState.user.id) &&
                        (element.senderid === nerdId ||
                            element.receiverid === nerdId) &&
                        element.accepted
                );
                //

                // Check for Requests
                const checkForRequest = data.friends?.filter(
                    (element) =>
                        element.receiverid === nerdId &&
                        element.senderid === mainState.user.id &&
                        !element.accepted
                );
                //

                // Check for RequestedMe
                const checkForRequested = data.friends?.filter(
                    (element) =>
                        element.senderid === nerdId &&
                        element.receiverid === mainState.user.id &&
                        !element.accepted
                );
                //

                //
                setNerd({
                    ...nerd,
                    nerdId,
                    nerdName,
                    userprofile: {
                        ...data.profile[0],
                        interests: JSON.parse(data.profile[0].interests),
                        movies: JSON.parse(data.profile[0].movies),
                        books: JSON.parse(data.profile[0].books),
                        games: JSON.parse(data.profile[0].games),
                    },
                    friends: getFriends,
                    isFriend: checkForFriendship.length > 0,
                    isRequested: checkForRequest.length > 0,
                    requestedMe: checkForRequested.length > 0,
                });
                //
            }
        };
        const getMyFriends = async () => {
            const data = await FetchReq(false, "/get/myprofile");
            if (data) {
                const action = setFriends(data.friends);
                dispatch(action);
            }
        };
        if (mainState.user) {
            getProfile();
            getMyFriends();
        }
    }, [mainState]);
    //

    // Socket for Chat Messages
    const chatMessages = useSelector((state) =>
        state?.chatMessages?.filter((current) => {
            if (current.senderid === nerd.nerdId) {
                return current;
            } else if (current.receiverid === nerd.nerdId) {
                return current;
            }
        })
    );
    //

    // Functions
    const makeFriendRequest = async () => {
        const payload = {
            senderid: mainState.user.id,
            sendername: mainState.user.username,
            senderavatar: mainState.userprofile.avatar,
            senderbg: mainState.userprofile.bg,
            senderpic: mainState.userprofile.pic,
            receiverid: nerd.nerdId,
            receivername: nerd.nerdName,
            receiveravatar: nerd.userprofile.avatar,
            receiverbg: nerd.userprofile.bg,
            receiverpic: nerd.userprofile.pic,
            accepted: false,
        };
        const data = await FetchReq(true, "/add/request", payload);
        if (data) {
            location.reload();
        }
    };
    const chatClick = () => {
        window.scrollTo(0, profileNavRef.current.offsetTop);
    };
    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("newChatMessage", {
                senderid: mainState.user.id,
                receiverid: nerd.nerdId,
                message: e.target.value,
            });
            textareaRef.current.value = "";
        }
    };
    //

    return (
        <>
            {/* HEAD */}
            <div className="profile_head">
                <div className="pic_info_container">
                    <div className={`profile_pic ${nerd.userprofile?.bg}`}>
                        <img
                            className={
                                nerd.userprofile?.pic === "noPic"
                                    ? "avatar_img"
                                    : "full_img"
                            }
                            src={
                                nerd.userprofile?.pic === "noPic"
                                    ? `/assets/${nerd.userprofile?.avatar}.svg`
                                    : nerd.userprofile?.pic
                            }
                        />
                    </div>
                    <div className="infos">
                        <p className="username">{nerd.userprofile?.username}</p>
                        <p className="description">
                            {nerd.userprofile?.introduction}
                        </p>
                    </div>
                </div>
            </div>
            {/* NAV */}
            <div className="profile_nav" ref={profileNavRef}>
                <div className="nav_inner">
                    <div
                        className={nav === "profile" ? "underlined" : "free"}
                        onClick={() => setNav("profile")}
                    >
                        <img src={Logo_Full} alt="Nerd Logo" />
                        <p>Profile</p>
                    </div>
                    <div
                        className={nav === "friends" ? "underlined" : "free"}
                        onClick={() => {
                            setNav("friends");
                            setTimeout(() => {
                                chatClick();
                            }, 200);
                        }}
                    >
                        <p className="counter">{nerd.friends?.length}</p>
                        <p>Friends</p>
                    </div>
                    {nerd.isFriend && (
                        <div
                            className={
                                nav === "chat"
                                    ? "underlined middle_nerd"
                                    : "free middle_nerd"
                            }
                            onClick={() => {
                                setNav("chat");
                                setTimeout(() => {
                                    chatClick();
                                }, 200);
                            }}
                        >
                            <img src={Chat} />
                            <p>Chat</p>
                        </div>
                    )}
                </div>
                <div id="button_container">
                    {nerd.isFriend && (
                        <>
                            <button
                                id="follow"
                                onClick={() => {
                                    deleteFriend({
                                        senderid: nerd.nerdId,
                                        receiverid: mainState.user.id,
                                    });
                                }}
                            >
                                Disconnect
                            </button>
                        </>
                    )}
                    {nerd.isRequested && (
                        <button
                            id="reject"
                            onClick={() => {
                                deleteFriend({
                                    senderid: nerd.nerdId,
                                    receiverid: mainState.user.id,
                                });
                            }}
                        >
                            Cancel Request
                        </button>
                    )}
                    {nerd.requestedMe && (
                        <>
                            <button
                                id="follow"
                                onClick={() => {
                                    accept({
                                        senderid: nerd.nerdId,
                                        receiverid: mainState.user.id,
                                    });
                                }}
                            >
                                Accept
                            </button>
                            <button
                                id="reject"
                                onClick={() => {
                                    deleteFriend({
                                        senderid: nerd.nerdId,
                                        receiverid: mainState.user.id,
                                    });
                                }}
                            >
                                Reject Friend Request
                            </button>
                        </>
                    )}
                    {!nerd.isFriend && !nerd.isRequested && !nerd.requestedMe && (
                        <button id="follow" onClick={makeFriendRequest}>
                            Make a Connection
                        </button>
                    )}
                    <Link to="/">
                        {mainState.userprofile?.pic === "noPic" && (
                            <div
                                className={`pic_container ${mainState.userprofile?.bg}`}
                            >
                                <img
                                    src={`/assets/${mainState.userprofile?.avatar}.svg`}
                                    className="avatar_img"
                                />
                            </div>
                        )}
                        {mainState.userprofile?.pic !== "noPic" && (
                            <div className={`pic_container full`}>
                                <img src={mainState.userprofile?.pic} />
                            </div>
                        )}
                    </Link>
                </div>
            </div>
            {/* USER INFO */}
            {nav === "profile" && nerd && nerd.userprofile && (
                <div className="profile">
                    <Renderprofile
                        profile={nerd.userprofile}
                        myProfile={false}
                    />
                </div>
            )}
            {/* NERDS FRIENDS */}
            {nav === "friends" && nerd && nerd.friends && (
                <div className="friends_container">
                    {nerd.friends.length > 0 && (
                        <>
                            <p className="title">Nerd Friends</p>
                            {nerd.friends.map((element, i) => {
                                if (
                                    element.senderid === mainState.user.id ||
                                    element.receiverid === mainState.user.id
                                ) {
                                    console.log("Me");
                                    return <Me key={i} />;
                                } else if (element.senderid === nerd.nerdId) {
                                    // Nerd is the sender of that Request
                                    console.log(
                                        "Nerd is the sender of that Request"
                                    );
                                    return (
                                        <Friend
                                            key={i}
                                            id={element.receiverid}
                                            name={element.receivername}
                                            avatar={element.receiveravatar}
                                            bg={element.receiverbg}
                                            pic={element.receiverpic}
                                        />
                                    );
                                } else {
                                    // Nerd is NOT the sender of that Request
                                    console.log(
                                        "Nerd is NOT the sender of that Request"
                                    );
                                    return (
                                        <Friend
                                            key={i}
                                            id={element.senderid}
                                            name={element.sendername}
                                            avatar={element.senderavatar}
                                            bg={element.senderbg}
                                            pic={element.senderpic}
                                        />
                                    );
                                }
                            })}
                        </>
                    )}
                </div>
            )}
            {/* CHAT */}
            {nav === "chat" && nerd && (
                <div className="nerd_chat_container">
                    <div className="messages">
                        {(chatMessages?.length > 0 &&
                            chatMessages?.map((current, i) => {
                                if (current.senderid === nerd.nerdId) {
                                    // Nerd is sender
                                    return (
                                        <div className="message" key={i}>
                                            <p className="sender_name">
                                                {nerd.nerdName}
                                            </p>
                                            <p className="text">
                                                {current.message}
                                            </p>
                                        </div>
                                    );
                                } else {
                                    // I'm sender
                                    return (
                                        <div className="message" key={i}>
                                            <p className="sender_name">
                                                {mainState.user.username}
                                            </p>
                                            <p className="text">
                                                {current.message}
                                            </p>
                                        </div>
                                    );
                                }
                            })) || (
                            <div className="notfound_container">
                                Be the First One to write...
                            </div>
                        )}
                    </div>
                    <div className="input_container">
                        <textarea
                            name="message"
                            cols="30"
                            rows="5"
                            onKeyDown={keyCheck}
                            ref={textareaRef}
                            placeholder="Press Enter to send Message..."
                        ></textarea>
                    </div>
                </div>
            )}
        </>
    );
};

export default Nerd;
