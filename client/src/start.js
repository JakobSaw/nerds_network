import { render } from "react-dom";
import App from "./App";
import Onboarding from "./Onboarding";
import "./App.scss";
const appElement = document.querySelector("main");

// Redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import * as immutableState from "redux-immutable-state-invariant";
import reducer from "./redux/reducer";
//

// Socket
import { init } from "./Utilities/socket";
//

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

//
fetch("/checkCookie")
    .then((response) => response.json())
    .then((data) => {
        if (!data.user) {
            render(<Onboarding />, appElement);
        } else {
            init(store);
            render(
                <Provider store={store}>
                    <App user={data.user} />
                </Provider>,
                appElement
            );
        }
    });
