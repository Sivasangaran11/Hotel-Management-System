import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router} from "react-router-dom";
import App from "./App.jsx";

const Root = () => {
  return (
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  );
};

ReactDOM.render(
  <Root />, // Render your Root component
  document.getElementById("root")
);
