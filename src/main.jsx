import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./tools/vh100-mobile.js";

import store from "./redux/redux-store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
 <React.StrictMode>
  <Provider store={store}>
   <App />
  </Provider>
 </React.StrictMode>
);
