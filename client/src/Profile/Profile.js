import { useContext, useState, useRef, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import Renderprofile from "./Renderprofile";
import Result from "./Result";
import MainContext from "../context/MainContext";
import Logo_Full from "../assets/Full_Logo.svg";
import Logout from "../assets/Logout.svg";
import Lupe from "../assets/Lupe.svg";
import FetchReq from "../Utilities/FetchReq";
import useResults from "../Utilities/useResults";
import useFriends from "../Utilities/useFriends";
//

// Redux
import { useSelector, useDispatch } from "react-redux";
import { setFriends } from "../redux/friends/slice";
//

const Profile = () => {
    // MainState & Refs
    const { mainState } = useContext(MainContext);
    const profileNavRef = useRef();
    //

    // States and Hooks
    const [nav, setNav] = useState("profile");
    const [results, handleSearch, handleResultsClick] = useResults();
    const [accept, deleteFriend] = useFriends();
    //

    // Redux
    const dispatch = useDispatch();
    const friends = useSelector((state) =>
        state.friends?.filter((friend) => friend.accepted)
    );
    const friendRequests = useSelector((state) =>
        state.friends?.filter(
            (friend) =>
                !friend.accepted && friend.senderid !== mainState.user.id
        )
    );
    // Action: setFriends
    useEffect(() => {
        const getProfile = async () => {
            const data = await FetchReq(false, "/get/myprofile");
            if (data) {
                const action = setFriends(data.friends);
                dispatch(action);
            }
        };
        if (mainState.user) {
            getProfile();
        }
    }, [mainState]);
    //

    // Functions
    const logout = () => {
        fetch("/logout").then(() => {
            window.location.href = "/login";
        });
    };
    const searchBarClick = () => {
        window.scrollTo(0, profileNavRef.current.offsetTop);
    };

    //
    return (
        <>
            {/* HEAD */}
            <div className="profile_head">
                <div className="pic_info_container">
                    <div className={`profile_pic ${mainState.userprofile?.bg}`}>
                        <img
                            className={
                                mainState.userprofile?.pic === "noPic"
                                    ? "avatar_img"
                                    : "full_img"
                            }
                            src={
                                mainState.userprofile?.pic === "noPic"
                                    ? `/assets/${mainState.userprofile?.avatar}.svg`
                                    : mainState.userprofile?.pic
                            }
                        />
                    </div>
                    <div className="infos">
                        <p className="username">{mainState.user?.username}</p>
                        <p className="description">
                            {mainState.userprofile?.introduction}
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
                            searchBarClick();
                        }}
                    >
                        <p className="counter">{friends?.length || 0}</p>
                        <p>Friends</p>
                    </div>
                </div>
                <div className="searchbar_container">
                    <input
                        type="text"
                        name="search"
                        id="search_bar"
                        placeholder="What are you looking for?"
                        onChange={handleSearch}
                        onClick={searchBarClick}
                    />
                </div>
                <div id="button_container">
                    <img src={Lupe} className="lupe" />
                    <Link to="/edit">
                        <button id="follow">Edit Profile</button>
                    </Link>
                    <img src={Logout} className="logout" onClick={logout} />
                </div>
            </div>
            {/* SEARCH RESULTS */}
            {results.show && (
                <div className="search_container">
                    <div className="search_inner">
                        {results.content.length > 0 &&
                            results.content.map((element, i) => {
                                return (
                                    <Result
                                        key={i}
                                        num={i}
                                        type={element.type}
                                        name={element.name}
                                        handleResultsClick={handleResultsClick}
                                        searchbar={results.searchbar}
                                    />
                                );
                            })}
                        {!results.content.length && (
                            <p className="noResults">No Results</p>
                        )}
                    </div>
                </div>
            )}
            {/* MY INFO */}
            {nav === "profile" && mainState.userprofile && (
                <div className="profile">
                    <Renderprofile
                        profile={mainState.userprofile}
                        myProfile={true}
                    />
                </div>
            )}
            {/* FRIENDS */}
            {nav === "friends" && mainState.userprofile && (
                <div className="friends_container">
                    {friendRequests && friendRequests.length > 0 && (
                        <>
                            <p className="title">
                                Nerds who want to be friends with me
                            </p>
                            {friendRequests.map((element, i) => {
                                console.log("Request in Profile", element);
                                return (
                                    <Fragment key={i}>
                                        <Link
                                            to={`/nerd/${element.senderid}/${element.sendername}`}
                                        >
                                            <div className="inner_container">
                                                <div
                                                    className={`pic_container ${
                                                        element.senderbg || "p"
                                                    }`}
                                                >
                                                    {element.senderpic ===
                                                        "noPic" && (
                                                        <img
                                                            src={`/assets/${element.senderavatar}.svg`}
                                                            className="avatar_img"
                                                        />
                                                    )}
                                                    {element.senderpic !==
                                                        "noPic" && (
                                                        <img
                                                            src={
                                                                element.senderpic
                                                            }
                                                            className="full_img"
                                                        />
                                                    )}
                                                </div>
                                                <div className="content">
                                                    <p className="name">
                                                        {element.sendername}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="disconnect_container">
                                            <button
                                                id="follow"
                                                onClick={() => accept(element)}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                id="reject"
                                                onClick={() =>
                                                    deleteFriend(element)
                                                }
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </Fragment>
                                );
                            })}
                        </>
                    )}
                    {friends && friends.length > 0 && (
                        <>
                            <p className="title">My Nerd Friends</p>
                            {friends.map((element, i) => {
                                if (element.senderid === mainState.user.id) {
                                    return (
                                        <Fragment key={i}>
                                            <Link
                                                to={`/nerd/${element.receiverid}/${element.receivername}`}
                                            >
                                                <div className="inner_container">
                                                    <div
                                                        className={`pic_container ${
                                                            element.receiverbg ||
                                                            "p"
                                                        }`}
                                                    >
                                                        {element.receiverpic ===
                                                            "noPic" && (
                                                            <img
                                                                src={`/assets/${element.receiveravatar}.svg`}
                                                                className="avatar_img"
                                                            />
                                                        )}
                                                        {element.receiverpic !==
                                                            "noPic" && (
                                                            <img
                                                                src={
                                                                    element.receiverpic
                                                                }
                                                                className="full_img"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="content">
                                                        <p className="name">
                                                            {
                                                                element.receivername
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className="disconnect_container">
                                                <button
                                                    className="reject"
                                                    onClick={() =>
                                                        deleteFriend(element)
                                                    }
                                                >
                                                    Disconnect
                                                </button>
                                            </div>
                                        </Fragment>
                                    );
                                } else {
                                    // I was NOT the Sender so use sender for Content
                                    return (
                                        <Fragment key={i}>
                                            <Link
                                                to={`/nerd/${element.senderid}/${element.sendername}`}
                                            >
                                                <div className="inner_container">
                                                    <div
                                                        className={`pic_container ${
                                                            element.senderbg ||
                                                            "p"
                                                        }`}
                                                    >
                                                        {element.senderpic ===
                                                            "noPic" && (
                                                            <img
                                                                src={`/assets/${element.senderavatar}.svg`}
                                                                className="avatar_img"
                                                            />
                                                        )}
                                                        {element.senderpic !==
                                                            "noPic" && (
                                                            <img
                                                                src={
                                                                    element.senderpic
                                                                }
                                                                className="full_img"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="content">
                                                        <p className="name">
                                                            {element.sendername}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className="disconnect_container">
                                                <button
                                                    className="reject"
                                                    onClick={() =>
                                                        deleteFriend(element)
                                                    }
                                                >
                                                    Disconnect
                                                </button>
                                            </div>
                                        </Fragment>
                                    );
                                }
                            })}
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Profile;
