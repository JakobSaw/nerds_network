import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Registration from "./Onboarding/Registration";
import Login from "./Onboarding/Login";
import Full_Logo from "./assets/Full_Logo.svg";

const Onboarding = () => {
    return (
        <div className="onboarding_container">
            <div className="title">
                <img src={Full_Logo} alt="Full Nerd Logo" />
                <div>
                    <h1>
                        Welcome
                        <br />
                        to <span>Nerd</span>
                    </h1>
                    <p>
                        A Place for
                        <br />
                        enthusiastic People to
                        <br />
                        obsessively discuss ideas.
                    </p>
                </div>
            </div>
            <div className="content">
                <Router>
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="*" component={Registration} />
                    </Switch>
                </Router>
            </div>
        </div>
    );
};

export default Onboarding;
