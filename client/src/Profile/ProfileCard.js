import { Fragment } from "react";
import { Link } from "react-router-dom";

const ProfileCard = ({ title, content, bgClass, type }) => {
    return (
        <div
            className={`profile_card ${bgClass} ${
                Array.isArray(content) ? "span_grid_item" : "hover_string"
            }`}
        >
            <p className="title">{title}</p>
            <div
                className={`${
                    Array.isArray(content) ? "content_array" : "content_string"
                }`}
            >
                {/* ARRAY */}
                {Array.isArray(content) &&
                    content.length > 0 &&
                    content.map((element, i) => {
                        return (
                            <Fragment key={i}>
                                <Link to={`/group/${element}/${type}`}>
                                    <div className="array_child">
                                        <p>{element}</p>
                                    </div>
                                </Link>
                            </Fragment>
                        );
                    })}
                {/* STRING */}
                {typeof content === "string" && <p>{content}</p>}
            </div>
        </div>
    );
};

export default ProfileCard;
