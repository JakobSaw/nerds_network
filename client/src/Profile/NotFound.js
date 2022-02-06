import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="notfound_container">
            <h1>404</h1>
            <p>The Page you are looking for was not found.</p>
            <Link to="/">Go To Home</Link>
        </div>
    );
};

export default NotFound;
