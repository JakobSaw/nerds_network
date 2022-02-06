import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
    const [formState, setFormState] = useState({
        userinfo: null,
        password: null,
        error: "",
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formState.userinfo || !formState.password) {
            setFormState({
                ...formState,
                error: "Every Field is required",
            });
            return;
        }
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formState),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.notfound) {
                    setFormState({
                        ...formState,
                        error: "No User was found",
                    });
                } else if (data.wrongpassword) {
                    setFormState({
                        ...formState,
                        error: "Wrong Password",
                    });
                } else if (data.success) {
                    window.location.href = "/";
                } else {
                    setFormState({
                        ...formState,
                        error: "Something went wrong",
                    });
                }
            })
            .catch(() => {
                setFormState({
                    ...formState,
                    error: "An Error occurred",
                });
            });
    };
    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        });
    };
    return (
        <>
            <p className="hello">Login</p>
            {location.search.includes("success") && (
                <p className="success">Successfully reseted your password!</p>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group first_form_element">
                    <input
                        name="userinfo"
                        type="text"
                        onChange={handleChange}
                        className={formState.userinfo ? "has-value" : ""}
                    />
                    <label htmlFor="userinfo">Username or Email</label>
                </div>
                <div className="form-group">
                    <input
                        name="password"
                        type="password"
                        onChange={handleChange}
                        className={formState.password ? "has-value" : ""}
                    />
                    <label htmlFor="password">Password</label>
                </div>
                {formState.error && <p className="error">{formState.error}</p>}
                <div className="submit_button_container">
                    <Link to="/">Not a Nerd yet?</Link>
                    <input type="submit" value="Login" />
                </div>
            </form>
        </>
    );
};

export default Login;
