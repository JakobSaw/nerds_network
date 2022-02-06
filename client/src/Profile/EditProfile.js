import { useState, useRef, Fragment, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import MainContext from "../context/MainContext";
import PlaySVG from "../assets/Play.svg";
import ActiveSVG from "../assets/Activities.svg";
import BookSVG from "../assets/Book.svg";
import BioSVG from "../assets/Bio.svg";
import BrainSVG from "../assets/Brain.svg";
import LogoSVG from "../assets/Full_Logo.svg";
import HeartSVG from "../assets/Heart.svg";
import ChemicSVG from "../assets/Chemicals.svg";
import LightSVG from "../assets/Light.svg";
import DevSVG from "../assets/Dev.svg";
import CubeSVG from "../assets/Cube.svg";
import RobotSVG from "../assets/Robot.svg";
import UfoSVG from "../assets/Ufo.svg";
import GameboySVG from "../assets/Gameboy.svg";
import MathSVG from "../assets/Math.svg";
import Upload from "../assets/Upload.svg";
import Loading from "../assets/loading.gif";

const EditProfile = () => {
    const { mainState } = useContext(MainContext);
    const [formState, setFormState] = useState({
        showAvatars: false,
        showUpload: true,
        avatar: null,
        imgSrc: null,
        profilepicfile: null,
        userprofile: {
            bg: "l",
            interests: [],
            movies: [],
            books: [],
            games: [],
        },
        error: "",
    });
    const [showLoading, setShowLoading] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        // Check for Friends & FriendRequests Update
        console.log({
            avatar: formState.userprofile.avatar,
            bg: formState.userprofile.bg,
            pic: formState.userprofile.pic,
            id: mainState.user.id,
        });
        fetch("/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                avatar: formState.userprofile.avatar,
                bg: formState.userprofile.bg,
                pic: formState.userprofile.pic,
                id: mainState.user.id,
            }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    fetch("/updateprofile", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ...formState.userprofile,
                            interests: JSON.stringify(
                                formState.userprofile.interests
                            ),
                            movies: JSON.stringify(
                                formState.userprofile.movies
                            ),
                            books: JSON.stringify(formState.userprofile.books),
                            games: JSON.stringify(formState.userprofile.games),
                        }),
                    })
                        .then((resp) => resp.json())
                        .then((data) => {
                            if (data.success) {
                                window.location.href = "/";
                            } else {
                                setFormState({
                                    ...formState,
                                    error: "Something went wrong, please try again.",
                                });
                            }
                        });
                } else {
                    alert("Error");
                }
            });
    };
    const handleChange = (e) => {
        if (e.target.name.includes("_input")) {
            setFormState({
                ...formState,
                [e.target.name]: e.target.value,
            });
        } else {
            setFormState({
                ...formState,
                userprofile: {
                    ...formState.userprofile,
                    [e.target.name]: e.target.value,
                },
            });
        }
    };
    const selectAvatar = (e) => {
        let avatar = e.target.parentNode.classList[0];
        if (avatar === "avatars_container") {
            avatar = e.target.classList[0];
        }
        setFormState({
            ...formState,
            showUpload: false,
            imgSrc: `/assets/${avatar}.svg`,
            showAvatars: false,
            userprofile: {
                ...formState.userprofile,
                avatar,
                pic: "noPic",
            },
        });
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            let parent = e.target.name.substring(0, e.target.name.length - 6);
            setFormState({
                ...formState,
                [e.target.name]: null,
                userprofile: {
                    ...formState.userprofile,
                    [parent]: [
                        ...formState.userprofile[parent],
                        e.target.value,
                    ],
                },
            });
            e.target.value = "";
        }
    };
    const getBase64 = (file) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            const fd = new FormData();
            fd.append("file", file);
            fetch("/uploadpic", {
                method: "POST",
                body: fd,
            })
                .then((resp) => resp.json())
                .then((result) => {
                    setShowLoading(false);
                    setFormState({
                        ...formState,
                        showUpload: false,
                        imgSrc: `${reader.result}`,
                        showAvatars: false,
                        profilepicfile: file,
                        userprofile: {
                            ...formState.userprofile,
                            pic: result,
                        },
                    });
                });
        };
    };
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setShowLoading(true);
        getBase64(file);
    };
    const handleDelete = (e, content) => {
        const newArray = formState.userprofile[
            e.target.parentNode.parentNode.classList[1]
        ].filter((element) => {
            if (element !== content) {
                return element;
            }
        });
        setFormState({
            ...formState,
            userprofile: {
                ...formState.userprofile,
                [e.target.parentNode.parentNode.classList[1]]: newArray,
            },
        });
    };
    const changeBG = (newClass) => {
        setFormState({
            ...formState,
            userprofile: {
                ...formState.userprofile,
                bg: newClass,
            },
        });
    };
    const pic_upload_ref = useRef();
    useEffect(() => {
        if (mainState.userprofile) {
            setFormState({
                ...formState,
                showUpload: false,
                imgSrc: mainState.userprofile.pic,
                userprofile: {
                    ...mainState.userprofile,
                },
            });
        }
    }, [mainState]);
    return (
        <div className="edit_container">
            <div className="edit_inner">
                {location.search.includes("create") && (
                    <p className="success">Create your profile</p>
                )}
                <form onSubmit={handleSubmit}>
                    {/* PIC UPLOAD */}
                    <div className="pic_container">
                        <p>My Profile Picture</p>
                        <div
                            className={`profile_pic ${formState.userprofile.bg}`}
                        >
                            <div
                                className="hover_state"
                                onClick={() => {
                                    pic_upload_ref.current.click();
                                }}
                            >
                                {showLoading && (
                                    <img id="upload_icon" src={Loading} />
                                )}
                                {!showLoading && formState.showUpload && (
                                    <img id="upload_icon" src={Upload} />
                                )}
                                {formState.imgSrc && !showLoading && (
                                    <img
                                        src={
                                            formState.imgSrc.includes(
                                                "https"
                                            ) ||
                                            formState.imgSrc.includes("base64")
                                                ? formState.imgSrc
                                                : `/assets/${formState.userprofile?.avatar}.svg`
                                        }
                                        className={
                                            formState.imgSrc.includes(
                                                "https"
                                            ) ||
                                            formState.imgSrc.includes("base64")
                                                ? "full_img"
                                                : "avatar_img"
                                        }
                                    />
                                )}
                            </div>
                        </div>
                        <input
                            type="file"
                            name="picture"
                            id="pic_upload"
                            ref={pic_upload_ref}
                            onChange={handleFileUpload}
                        />
                        <p
                            onClick={() => {
                                setFormState({
                                    ...formState,
                                    showAvatars: !formState.showAvatars,
                                });
                            }}
                        >
                            or Choose an Avatar
                        </p>
                    </div>
                    {/* AVATARS */}
                    {formState.showAvatars && (
                        <>
                            <div className="colors_container">
                                <div className="colors_inner">
                                    <div
                                        className="p"
                                        onClick={() => changeBG("p")}
                                    ></div>
                                    <div
                                        className="l"
                                        onClick={() => changeBG("l")}
                                    ></div>
                                    <div
                                        className="y"
                                        onClick={() => changeBG("y")}
                                    ></div>
                                    <div
                                        className="g"
                                        onClick={() => changeBG("g")}
                                    ></div>
                                    <div
                                        className="r"
                                        onClick={() => changeBG("r")}
                                    ></div>
                                </div>
                            </div>
                            <div className="avatars_container">
                                <div
                                    className={`Play ${formState.userprofile.bg}`}
                                    onClick={selectAvatar}
                                >
                                    <img src={PlaySVG} />
                                </div>
                                <div
                                    className={`Activities ${formState.userprofile.bg}`}
                                    onClick={selectAvatar}
                                >
                                    <img src={ActiveSVG} />
                                </div>
                                <div
                                    className={`Book ${formState.userprofile.bg}`}
                                    onClick={selectAvatar}
                                >
                                    <img src={BookSVG} />
                                </div>
                                <div
                                    className={`Bio ${formState.userprofile.bg}`}
                                    onClick={selectAvatar}
                                >
                                    <img src={BioSVG} />
                                </div>
                                <div
                                    className={`Brain ${formState.userprofile.bg}`}
                                    onClick={selectAvatar}
                                >
                                    <img src={BrainSVG} />
                                </div>
                                <div
                                    className={`Full_Logo ${formState.userprofile.bg}`}
                                    onClick={selectAvatar}
                                >
                                    <img src={LogoSVG} />
                                </div>
                                <div
                                    className={`Heart ${formState.userprofile.bg}`}
                                    onClick={selectAvatar}
                                >
                                    <img src={HeartSVG} />
                                </div>
                                <div
                                    className={`Chemicals ${formState.userprofile.bg}`}
                                    onClick={selectAvatar}
                                >
                                    <img src={ChemicSVG} />
                                </div>
                                <div
                                    className={`Light ${formState.userprofile.bg}`}
                                    onClick={selectAvatar}
                                >
                                    <img src={LightSVG} />
                                </div>
                                <div
                                    className={`Dev ${formState.userprofile.bg}`}
                                    onClick={selectAvatar}
                                >
                                    <img src={DevSVG} />
                                </div>
                                <div
                                    className={`Cube ${formState.userprofile.bg}`}
                                    onClick={selectAvatar}
                                >
                                    <img src={CubeSVG} />
                                </div>
                                <div
                                    className={`Robot ${formState.userprofile.bg}`}
                                    onClick={selectAvatar}
                                >
                                    <img src={RobotSVG} />
                                </div>
                                <div
                                    className={`Ufo ${formState.userprofile.bg}`}
                                    onClick={selectAvatar}
                                >
                                    <img src={UfoSVG} />
                                </div>
                                <div
                                    className={`Gameboy ${formState.userprofile.bg}`}
                                    onClick={selectAvatar}
                                >
                                    <img src={GameboySVG} />
                                </div>
                                <div
                                    className={`Math ${formState.userprofile.bg}`}
                                    onClick={selectAvatar}
                                >
                                    <img src={MathSVG} />
                                </div>
                            </div>
                        </>
                    )}
                    {/* PROFILE */}
                    <p>Tell us about yourself</p>
                    <Fragment>
                        <div className="form-group first_form_element">
                            <input
                                name="introduction"
                                type="text"
                                onChange={handleChange}
                                className={
                                    formState.userprofile?.introduction
                                        ? "has-value"
                                        : ""
                                }
                                value={
                                    formState.userprofile?.introduction || ""
                                }
                            />
                            <label htmlFor="introduction">
                                One Sentence to describe Myself
                            </label>
                        </div>
                        <div className="form-group first_form_element">
                            <input
                                name="studies"
                                type="text"
                                onChange={handleChange}
                                className={
                                    formState.userprofile?.studies
                                        ? "has-value"
                                        : ""
                                }
                                value={formState.userprofile?.studies || ""}
                            />
                            <label htmlFor="studies">My Studies</label>
                        </div>
                        <div className="form-group first_form_element">
                            <input
                                name="university"
                                type="text"
                                onChange={handleChange}
                                className={
                                    formState.userprofile?.university
                                        ? "has-value"
                                        : ""
                                }
                                value={formState.userprofile?.university || ""}
                            />
                            <label htmlFor="university">My University</label>
                        </div>
                        <div className="form-group first_form_element">
                            <input
                                name="workplace"
                                type="text"
                                onChange={handleChange}
                                className={
                                    formState.userprofile?.workplace
                                        ? "has-value"
                                        : ""
                                }
                                value={formState.userprofile?.workplace || ""}
                            />
                            <label htmlFor="workplace">My Workplace</label>
                        </div>
                        <div className="form-group first_form_element">
                            <input
                                name="idea"
                                type="text"
                                onChange={handleChange}
                                className={
                                    formState.userprofile?.idea
                                        ? "has-value"
                                        : ""
                                }
                                value={formState.userprofile?.idea || ""}
                            />
                            <label htmlFor="idea">
                                My idea to change the World
                            </label>
                        </div>
                        <div className="form-group first_form_element">
                            <input
                                name="superpower"
                                type="text"
                                onChange={handleChange}
                                className={
                                    formState.userprofile?.superpower
                                        ? "has-value"
                                        : ""
                                }
                                value={formState.userprofile?.superpower || ""}
                            />
                            <label htmlFor="superpower">
                                If I could have a superpower...
                            </label>
                        </div>
                        <div className="form-group no_bottom_margin">
                            <input
                                name="interests_input"
                                type="text"
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className={
                                    formState.interests_input ? "has-value" : ""
                                }
                            />
                            <label htmlFor="interests_input">
                                My Hobbies / Interests
                            </label>
                        </div>
                        <p className="small">Press Enter after each</p>
                        <div className="collection interests">
                            {formState.userprofile.interests.length > 0 &&
                                formState.userprofile.interests.map(
                                    (element, i) => {
                                        return (
                                            <div key={i}>
                                                {element}
                                                <span
                                                    onClick={(e) =>
                                                        handleDelete(e, element)
                                                    }
                                                >
                                                    X
                                                </span>
                                            </div>
                                        );
                                    }
                                )}
                        </div>
                        <div className="form-group no_bottom_margin">
                            <input
                                name="movies_input"
                                type="text"
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className={
                                    formState.movies_input ? "has-value" : ""
                                }
                            />
                            <label htmlFor="movies_input">
                                My Favorite Movie(s) or Series
                            </label>
                        </div>
                        <p className="small">Press Enter after each</p>
                        <div className="collection movies">
                            {formState.userprofile.movies.length > 0 &&
                                formState.userprofile.movies.map(
                                    (element, i) => {
                                        return (
                                            <div key={i}>
                                                {element}
                                                <span
                                                    onClick={(e) =>
                                                        handleDelete(e, element)
                                                    }
                                                >
                                                    X
                                                </span>
                                            </div>
                                        );
                                    }
                                )}
                        </div>
                        <div className="form-group no_bottom_margin">
                            <input
                                name="books_input"
                                type="text"
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className={
                                    formState.books_input ? "has-value" : ""
                                }
                            />
                            <label htmlFor="books_input">
                                My Favorite Book(s)
                            </label>
                        </div>
                        <p className="small">Press Enter after each</p>
                        <div className="collection books">
                            {formState.userprofile.books.length > 0 &&
                                formState.userprofile.books.map(
                                    (element, i) => {
                                        return (
                                            <div key={i}>
                                                {element}
                                                <span
                                                    onClick={(e) =>
                                                        handleDelete(e, element)
                                                    }
                                                >
                                                    X
                                                </span>
                                            </div>
                                        );
                                    }
                                )}
                        </div>
                        <div className="form-group no_bottom_margin">
                            <input
                                name="games_input"
                                type="text"
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className={
                                    formState.games_input ? "has-value" : ""
                                }
                            />
                            <label htmlFor="games_input">
                                My Favorite Computer Game(s)
                            </label>
                        </div>
                        <p className="small">Press Enter after each</p>
                        <div className="collection games">
                            {formState.userprofile.games.length > 0 &&
                                formState.userprofile.games.map(
                                    (element, i) => {
                                        return (
                                            <div key={i}>
                                                {element}
                                                <span
                                                    onClick={(e) =>
                                                        handleDelete(e, element)
                                                    }
                                                >
                                                    X
                                                </span>
                                            </div>
                                        );
                                    }
                                )}
                        </div>
                        <div className="forgot_container submit_container">
                            <Link to="/">Go Back</Link>
                            <input
                                type="submit"
                                value={
                                    location.search.includes("create")
                                        ? "Become a Nerd"
                                        : "Update Profile"
                                }
                            />
                        </div>
                    </Fragment>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
