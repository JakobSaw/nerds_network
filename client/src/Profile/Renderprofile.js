import ProfileCard from "./ProfileCard";
import { Link } from "react-router-dom";

const Renderprofile = ({ profile, myProfile }) => {
    const backgrounds = [
        null,
        null,
        null,
        "l",
        "p",
        "g",
        "y",
        "r",
        "l",
        "p",
        "g",
        "y",
    ];
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const EmptyProfile = () => {
        return (
            <div className="complete_profile_container">
                <p className="complete_profile">
                    This Nerd has not filled his/her Profile yet.
                </p>
            </div>
        );
    };
    const EditLink = () => {
        return (
            <Link to="/edit">
                <div className="complete_profile_container">
                    <p className="complete_profile">
                        Complete your Profile here... (Link to Edit Page)
                    </p>
                </div>
            </Link>
        );
    };
    return (
        <>
            {Object.keys(profile).map(function (keyName, keyIndex) {
                if (
                    keyName !== "userid" &&
                    keyName !== "username" &&
                    keyName !== "introduction" &&
                    keyName !== "created_at" &&
                    keyName !== "avatar" &&
                    keyName !== "bg" &&
                    keyName !== "pic" &&
                    profile[keyName]
                ) {
                    // use keyName to get current key's name
                    // console.log(keyName, keyIndex);
                    // and a[keyName] to get its value
                    // console.log(profile[keyName]);
                    let title = "";
                    if (keyName === "idea") {
                        title = "Idea to change the World";
                    } else if (Array.isArray(profile[keyName])) {
                        title = `My Favorite ${capitalizeFirstLetter(
                            keyName
                        )} ${keyName === "movies" ? "or Series" : ""}`;
                    } else {
                        title = capitalizeFirstLetter(keyName);
                    }
                    if (Array.isArray(profile[keyName])) {
                        // Array Childs
                        if (profile[keyName].length > 0) {
                            return (
                                <ProfileCard
                                    key={keyIndex}
                                    title={title}
                                    type={keyName}
                                    content={profile[keyName]}
                                    bgClass={backgrounds[keyIndex]}
                                />
                            );
                        }
                    } else {
                        return (
                            <Link
                                key={keyIndex}
                                to={`/group/${profile[keyName]}/${keyName}`}
                            >
                                <ProfileCard
                                    title={title}
                                    content={profile[keyName]}
                                    bgClass={backgrounds[keyIndex]}
                                />
                            </Link>
                        );
                    }
                }
            })}
            {/* NO USER INFO */}
            {!myProfile &&
                !profile?.studies &&
                !profile?.university &&
                !profile?.workplace &&
                !profile?.idea &&
                !profile?.superpower &&
                profile?.interests?.length < 1 &&
                profile?.movies?.length < 1 &&
                profile?.books?.length < 1 &&
                profile?.games?.length < 1 && <EmptyProfile />}
            {/* NO USER INFO */}
            {myProfile &&
                !profile?.studies &&
                !profile?.university &&
                !profile?.workplace &&
                !profile?.idea &&
                !profile?.superpower &&
                profile?.interests.length < 1 &&
                profile?.movies.length < 1 &&
                profile?.books.length < 1 &&
                profile?.games.length < 1 && <EditLink />}
        </>
    );
};

export default Renderprofile;
