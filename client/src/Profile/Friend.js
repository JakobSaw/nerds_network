import { Link } from "react-router-dom";

const Friend = ({ id, name, avatar, bg, pic }) => {
    return (
        <>
            <Link to={`/nerd/${id}/${name}`}>
                <div className="inner_container">
                    <div className={`pic_container ${bg || "p"}`}>
                        {pic === "noPic" && (
                            <img
                                src={`/assets/${avatar}.svg`}
                                className="avatar_img"
                            />
                        )}
                        {pic !== "noPic" && (
                            <img src={pic} className="full_img" />
                        )}
                    </div>
                    <div className="content">
                        <p className="name">{name}</p>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default Friend;
