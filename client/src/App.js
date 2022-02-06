import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Profile from "./Profile/Profile";
import EditProfile from "./Profile/EditProfile";
import Nerd from "./Profile/Nerd";
import Group from "./Profile/Group";
import NotFound from "./Profile/NotFound";
import MainContext from "./context/MainContext";
import ScrollToTop from "./Utilities/ScrollToTop";

const App = ({ user }) => {
    const [mainState, setMainState] = useState({
        user: null,
    });
    useEffect(() => {
        fetch(`/getprofile?userid=${user.id}`)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.notfound) {
                    setMainState({
                        ...mainState,
                        user,
                    });
                } else {
                    setMainState({
                        ...mainState,
                        user,
                        userprofile: {
                            ...data,
                            interests: JSON.parse(data.interests),
                            movies: JSON.parse(data.movies),
                            books: JSON.parse(data.books),
                            games: JSON.parse(data.games),
                        },
                    });
                }
            });
    }, [user.id]);
    return (
        <MainContext.Provider value={{ mainState, setMainState }}>
            <Router>
                <ScrollToTop />
                <Switch>
                    <Route path="/" exact component={Profile} />
                    <Route path="/edit" component={EditProfile} />
                    <Route
                        path="/nerd/:userid/:name"
                        render={(props) => <Nerd key={props.match.url} />}
                    />
                    <Route
                        path="/group/:name/:type"
                        render={(props) => <Group key={props.match.url} />}
                    />
                    <Route path="*" component={NotFound} />
                </Switch>
            </Router>
        </MainContext.Provider>
    );
};

export default App;
