import { useEffect, useState, Fragment, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Logo_Full from "../assets/Full_Logo.svg";
import Chat from "../assets/Chat.svg";
import MainContext from "../context/MainContext";

// Redux
import { useSelector } from "react-redux";
//

// Socket
import { socket } from "../Utilities/socket";
//

const Group = () => {
    const { mainState } = useContext(MainContext);
    const textareaRef = useRef();
    const [group, setGroup] = useState({
        bg: "l",
    });
    let { name: groupName, type: groupType } = useParams();
    useEffect(() => {
        if (mainState.user) {
            /* const groupName = new URLSearchParams(props.location.search).get(
                "name"
            );
            let groupType = new URLSearchParams(props.location.search).get(
                "type"
            ); */
            let setAvatar;
            if (groupType.includes("tudies")) {
                groupType = "Studies";
                setAvatar = "Brain";
            } else if (groupType.includes("niversity")) {
                groupType = "University";
                setAvatar = "Uni";
            } else if (groupType.includes("orkplace")) {
                groupType = "Workplace";
                setAvatar = "Robot";
            } else if (groupType.includes("dea")) {
                groupType = "Idea to Change the World";
                setAvatar = "Light";
            } else if (groupType.includes("power")) {
                groupType = "Superpower";
                setAvatar = "Superpower";
            } else if (groupType.includes("nterest")) {
                groupType = "Interest";
                setAvatar = "Heart";
            } else if (groupType.includes("ovie")) {
                groupType = "Movie or Series";
                setAvatar = "Movie";
            } else if (groupType.includes("ook")) {
                groupType = "Book";
                setAvatar = "Book";
            } else if (groupType.includes("ame")) {
                groupType = "Computer Game";
                setAvatar = "Play";
            }
            //  Fetch Nerds
            fetch(`/results?str=${groupName.toLowerCase()}`)
                .then((resp) => resp.json())
                .then((data) => {
                    setGroup({
                        ...group,
                        avatar: setAvatar || "Full_Logo",
                        name: groupName,
                        type: groupType,
                        nerds: [...data],
                    });
                });
        }
    }, [mainState]);
    const [nav, setNav] = useState("nerds");

    const groupMessages = useSelector((state) =>
        state?.groupMessages?.filter((current) => {
            if (current.group_name === group.name) {
                return current;
            }
        })
    );

    const profileNavRef = useRef();
    const chatClick = () => {
        window.scrollTo(0, profileNavRef.current.offsetTop);
    };

    // Function
    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("newGroupMessage", {
                senderid: mainState.user.id,
                sendername: mainState.user.username,
                group_name: group.name,
                message: e.target.value,
            });
            textareaRef.current.value = "";
        }
    };
    return (
        <>
            {/* HEAD */}
            <div className="profile_head">
                <div className="pic_info_container">
                    <div className={`profile_pic ${group.bg}`}>
                        <img
                            className="avatar_img"
                            src={`/assets/${group.avatar}.svg`}
                        />
                    </div>
                    <div className="infos">
                        <p className="username">{group.name}</p>
                        <p className="type">
                            {group.type !== "Movie"
                                ? group.type
                                : "Movie or Series"}
                        </p>
                        <p className="description">
                            Here you can discuss all around this Topic in one
                            Group.
                        </p>
                    </div>
                </div>
            </div>
            {/* NAV */}
            <div className="profile_nav" ref={profileNavRef}>
                <div className="nav_inner">
                    <div
                        className={nav === "nerds" ? "underlined" : "free"}
                        onClick={() => setNav("nerds")}
                    >
                        <img src={Logo_Full} />
                        <p>Nerds</p>
                    </div>
                    <div
                        className={nav === "chat" ? "underlined" : "free"}
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
                </div>
                <div id="button_container">
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
            {/* NERDS */}
            {nav === "nerds" && (
                <div className="nerds">
                    {group.nerds?.length > 0 &&
                        group.nerds?.map((element) => {
                            if (element.userid !== mainState.user.id) {
                                return (
                                    <Fragment key={element.userid}>
                                        <Link
                                            to={`/nerd/${element.userid}/${element.username}`}
                                        >
                                            <div className="nerd_container">
                                                <div
                                                    className={`pic_container ${element.bg}`}
                                                >
                                                    <img
                                                        className={
                                                            element.pic ===
                                                            "noPic"
                                                                ? "avatar_img"
                                                                : "full_img"
                                                        }
                                                        src={
                                                            element.pic ===
                                                            "noPic"
                                                                ? `/assets/${element.avatar}.svg`
                                                                : element.pic
                                                        }
                                                    />
                                                </div>
                                                <div className="content">
                                                    <p className="name">
                                                        {element.username}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </Fragment>
                                );
                            } else {
                                return (
                                    <Fragment key={element.userid}>
                                        <div className="nerd_container">
                                            <div
                                                className={`pic_container ${element.bg}`}
                                            >
                                                <img
                                                    className={
                                                        element.pic === "noPic"
                                                            ? "avatar_img"
                                                            : "full_img"
                                                    }
                                                    src={
                                                        element.pic === "noPic"
                                                            ? `/assets/${element.avatar}.svg`
                                                            : element.pic
                                                    }
                                                />
                                            </div>
                                            <div className="content">
                                                <p className="name">
                                                    {element.username} (Me)
                                                </p>
                                            </div>
                                        </div>
                                    </Fragment>
                                );
                            }
                        })}
                </div>
            )}
            {/* CHAT */}
            {nav === "chat" && group && (
                <div className="nerd_chat_container">
                    <div className="messages">
                        {(groupMessages?.length > 0 &&
                            groupMessages?.map((current, i) => {
                                if (current.senderid !== mainState.user.id) {
                                    return (
                                        <div className="message" key={i}>
                                            <Link
                                                to={`/nerd/${current.senderid}/${current.sendername}`}
                                            >
                                                <p className="sender_name">
                                                    {current.sendername}
                                                </p>
                                            </Link>
                                            <p className="text">
                                                {current.message}
                                            </p>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="message" key={i}>
                                            <p className="sender_name">
                                                {current.sendername} (Me)
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

export default Group;
