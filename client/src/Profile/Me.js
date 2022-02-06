import MainContext from "../context/MainContext";
import { useContext } from "react";

const Me = () => {
    const { mainState } = useContext(MainContext);
    return (
        <>
            <div className="inner_container">
                <div
                    className={`pic_container ${
                        mainState.userprofile.bg || "p"
                    }`}
                >
                    {mainState.userprofile.pic === "noPic" && (
                        <img
                            src={`/assets/${mainState.userprofile.avatar}.svg`}
                            className="avatar_img"
                        />
                    )}
                    {mainState.userprofile.pic !== "noPic" && (
                        <img
                            src={mainState.userprofile.pic}
                            className="full_img"
                        />
                    )}
                </div>
                <div className="content">
                    <p className="name">{mainState.user.username} (Me)</p>
                </div>
            </div>
        </>
    );
};

export default Me;
