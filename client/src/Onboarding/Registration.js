import { useState } from "react";
import { Link } from "react-router-dom";

const Registration = () => {
    const [formState, setFormState] = useState({
        username: null,
        email: null,
        password: null,
        error: "",
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formState.username || !formState.email || !formState.password) {
            setFormState({
                ...formState,
                error: "Every Field is required",
            });
            return;
        }
        fetch("/registration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formState),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data :>> ", data);
                if (data.name === "error" && data.detail.includes("username")) {
                    setFormState({
                        ...formState,
                        error: "Username already exists. Try a different one.",
                    });
                } else if (
                    data.name === "error" &&
                    data.detail.includes("email")
                ) {
                    setFormState({
                        ...formState,
                        error: "Mail Adress already exists. Try a different one.",
                    });
                } else if (data.success) {
                    window.location.href = "/edit?create=true";
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
            <p className="hello">Register</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group first_form_element">
                    <input
                        name="username"
                        type="text"
                        onChange={handleChange}
                        className={formState.username ? "has-value" : ""}
                    />
                    <label htmlFor="username">Username</label>
                </div>
                <div className="form-group">
                    <input
                        name="email"
                        type="email"
                        onChange={handleChange}
                        className={formState.email ? "has-value" : ""}
                    />
                    <label htmlFor="email">E-Mail</label>
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
                    <Link to="/login">Already a Nerd?</Link>
                    <input type="submit" value="Register" />
                </div>
            </form>
        </>
    );
};

export default Registration;
