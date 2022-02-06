import { useState, useContext } from "react";
import MainContext from "../context/MainContext";
import FetchReq from "./FetchReq";

function useResults() {
    const { mainState } = useContext(MainContext);
    const [results, setResults] = useState({
        show: false,
        searchbar: "",
        content: [],
    });

    const fetchResults = async (str) => {
        const data = await FetchReq(false, `/results?str=${str.toLowerCase()}`);
        if (data) {
            let all = [];
            data.forEach((result) => {
                if ("studies" in result) {
                    let alreadyInArray = false;
                    let points = 0;
                    all.forEach((element) => {
                        if (element.name === result.studies) {
                            const found = all.find(
                                (element) => element.name === result.studies
                            );
                            found.points += 1;
                            alreadyInArray = true;
                        }
                    });
                    if (!alreadyInArray) {
                        all = [
                            ...all,
                            {
                                type: "Studies",
                                name: result.studies,
                                points,
                            },
                        ];
                    }
                } else if ("university" in result) {
                    let alreadyInArray = false;
                    let points = 0;
                    all.forEach((element) => {
                        if (element.name === result.university) {
                            const found = all.find(
                                (element) => element.name === result.university
                            );
                            found.points += 1;
                            alreadyInArray = true;
                        }
                    });
                    if (!alreadyInArray) {
                        all = [
                            ...all,
                            {
                                type: "University",
                                name: result.university,
                                points,
                            },
                        ];
                    }
                } else if ("workplace" in result) {
                    let alreadyInArray = false;
                    let points = 0;
                    all.forEach((element) => {
                        if (element.name === result.workplace) {
                            const found = all.find(
                                (element) => element.name === result.workplace
                            );
                            found.points += 1;
                            alreadyInArray = true;
                        }
                    });
                    if (!alreadyInArray) {
                        all = [
                            ...all,
                            {
                                type: "Workplace",
                                name: result.workplace,
                                points,
                            },
                        ];
                    }
                } else if ("idea" in result) {
                    let alreadyInArray = false;
                    let points = 0;
                    all.forEach((element) => {
                        if (element.name === result.idea) {
                            const found = all.find(
                                (element) => element.name === result.idea
                            );
                            found.points += 1;
                            alreadyInArray = true;
                        }
                    });
                    if (!alreadyInArray) {
                        all = [
                            ...all,
                            {
                                type: "Idea to Change the World",
                                name: result.idea,
                                points,
                            },
                        ];
                    }
                } else if ("superpower" in result) {
                    let alreadyInArray = false;
                    let points = 0;
                    all.forEach((element) => {
                        if (element.name === result.superpower) {
                            const found = all.find(
                                (element) => element.name === result.superpower
                            );
                            found.points += 1;
                            alreadyInArray = true;
                        }
                    });
                    if (!alreadyInArray) {
                        all = [
                            ...all,
                            {
                                type: "Superpower",
                                name: result.superpower,
                                points,
                            },
                        ];
                    }
                } else if ("interests" in result) {
                    const parsedJSON = JSON.parse(result.interests);
                    if (Array.isArray(parsedJSON) && parsedJSON.length > 0) {
                        parsedJSON.forEach((interest) => {
                            if (
                                interest
                                    .toLowerCase()
                                    .includes(str.toLowerCase())
                            ) {
                                let alreadyInArray = false;
                                let points = 0;
                                all.forEach((element) => {
                                    if (element.name === interest) {
                                        const found = all.find(
                                            (element) =>
                                                element.name === interest
                                        );
                                        found.points += 1;
                                        alreadyInArray = true;
                                    }
                                });
                                if (!alreadyInArray) {
                                    all = [
                                        ...all,
                                        {
                                            type: "Interest",
                                            name: interest,
                                            points,
                                        },
                                    ];
                                }
                            }
                        });
                    }
                } else if ("movies" in result) {
                    const parsedJSON = JSON.parse(result.movies);
                    if (Array.isArray(parsedJSON) && parsedJSON.length > 0) {
                        parsedJSON.forEach((movie) => {
                            if (
                                movie.toLowerCase().includes(str.toLowerCase())
                            ) {
                                let alreadyInArray = false;
                                let points = 0;
                                all.forEach((element) => {
                                    if (element.name === movie) {
                                        const found = all.find(
                                            (element) => element.name === movie
                                        );
                                        found.points += 1;
                                        alreadyInArray = true;
                                    }
                                });
                                if (!alreadyInArray) {
                                    all = [
                                        ...all,
                                        {
                                            type: "Movie",
                                            name: movie,
                                            points,
                                        },
                                    ];
                                }
                            }
                        });
                    }
                } else if ("books" in result) {
                    const parsedJSON = JSON.parse(result.books);
                    if (Array.isArray(parsedJSON) && parsedJSON.length > 0) {
                        parsedJSON.forEach((book) => {
                            if (
                                book.toLowerCase().includes(str.toLowerCase())
                            ) {
                                let alreadyInArray = false;
                                let points = 0;
                                all.forEach((element) => {
                                    if (element.name === book) {
                                        const found = all.find(
                                            (element) => element.name === book
                                        );
                                        found.points += 1;
                                        alreadyInArray = true;
                                    }
                                });
                                if (!alreadyInArray) {
                                    all = [
                                        ...all,
                                        {
                                            type: "Book",
                                            name: book,
                                            points,
                                        },
                                    ];
                                }
                            }
                        });
                    }
                } else if ("games" in result) {
                    const parsedJSON = JSON.parse(result.games);
                    if (Array.isArray(parsedJSON) && parsedJSON.length > 0) {
                        parsedJSON.forEach((game) => {
                            if (
                                game.toLowerCase().includes(str.toLowerCase())
                            ) {
                                let alreadyInArray = false;
                                let points = 0;
                                all.forEach((element) => {
                                    if (element.name === game) {
                                        const found = all.find(
                                            (element) => element.name === game
                                        );
                                        found.points += 1;
                                        alreadyInArray = true;
                                    }
                                });
                                if (!alreadyInArray) {
                                    all = [
                                        ...all,
                                        {
                                            type: "Computer Game",
                                            name: game,
                                            points,
                                        },
                                    ];
                                }
                            }
                        });
                    }
                } else if (
                    "username" in result &&
                    mainState.user.id !== result.userid
                ) {
                    all = [
                        ...all,
                        {
                            type: "Nerd",
                            name: result.username,
                            userid: result.userid,
                            points: 9999999,
                        },
                    ];
                }
            });
            console.log(all);
            setResults({
                ...results,
                show: true,
                searchbar: str,
                content: all.sort(function (a, b) {
                    if (a.points > b.points) {
                        return -1;
                    }
                    if (a.points < b.points) {
                        return 1;
                    }
                    return 0;
                }),
            });
        }
    };
    const handleSearch = (e) => {
        if (e.target.value.length > 0) {
            fetchResults(e.target.value);
        } else {
            setResults({
                ...results,
                show: false,
            });
        }
    };
    const handleResultsClick = (key) => {
        const result = results.content[key];
        if (result.type === "Nerd") {
            window.location.href = `/nerd/${result.userid}/${result.name}`;
        } else {
            window.location.href = `/group/${result.name}/${result.type}`;
        }
    };

    return [results, handleSearch, handleResultsClick];
}

export default useResults;
