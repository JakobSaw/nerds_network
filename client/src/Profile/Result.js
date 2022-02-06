import { useEffect, useState, Fragment } from "react";
import UniSVG from "../assets/Uni.svg";
import NerdSVG from "../assets/Full_Logo.svg";
import BookSVG from "../assets/Book.svg";
import WorkplaceSVG from "../assets/Robot.svg";
import IdeaSVG from "../assets/Light.svg";
import SuperpowerSVG from "../assets/Superpower.svg";
import HeartSVG from "../assets/Heart.svg";
import MovieSVG from "../assets/Movie.svg";
import BrainSVG from "../assets/Brain.svg";
import GameSVG from "../assets/Play.svg";

const Result = ({ num, type, name, handleResultsClick, searchbar }) => {
    const [individualName, setIndividualName] = useState({
        first: "",
        bold: "",
        second: "",
    });
    useEffect(() => {
        let smallSearchbar = searchbar.toLowerCase(),
            smallName = name.toLowerCase(),
            index = smallName.indexOf(smallSearchbar);
        setIndividualName({
            first: name.slice(0, index),
            bold: name.slice(index, index + smallSearchbar.length),
            second: name.slice(index + smallSearchbar.length, smallName.length),
        });
    }, [searchbar]);
    return (
        <div
            className="result_container"
            onClick={() => handleResultsClick(num)}
        >
            <Fragment>
                {type === "Nerd" && (
                    <div className="pic_container">
                        <img src={NerdSVG} />
                    </div>
                )}
                {type === "Studies" && (
                    <div className="pic_container">
                        <img src={BrainSVG} />
                    </div>
                )}
                {type === "University" && (
                    <div className="pic_container">
                        <img src={UniSVG} />
                    </div>
                )}
                {type === "Workplace" && (
                    <div className="pic_container">
                        <img src={WorkplaceSVG} />
                    </div>
                )}
                {type === "Idea to Change the World" && (
                    <div className="pic_container">
                        <img src={IdeaSVG} />
                    </div>
                )}
                {type === "Superpower" && (
                    <div className="pic_container">
                        <img src={SuperpowerSVG} />
                    </div>
                )}
                {type === "Interest" && (
                    <div className="pic_container">
                        <img src={HeartSVG} />
                    </div>
                )}
                {type === "Movie" && (
                    <div className="pic_container">
                        <img src={MovieSVG} />
                    </div>
                )}
                {type === "Book" && (
                    <div className="pic_container">
                        <img src={BookSVG} />
                    </div>
                )}
                {type === "Computer Game" && (
                    <div className="pic_container">
                        <img src={GameSVG} />
                    </div>
                )}
            </Fragment>
            <div className="content">
                <p className="type">
                    {type !== "Movie" ? type : "Movie or Series"}
                </p>
                <p className="name">
                    {individualName.first}
                    <span>{individualName.bold}</span>
                    {individualName.second}
                </p>
            </div>
        </div>
    );
};

export default Result;
