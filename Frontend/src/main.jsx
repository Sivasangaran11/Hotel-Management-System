import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");

// Check if a root is already created
if (!rootElement._reactRootContainer) {
  const root = createRoot(rootElement);

  const Root = () => {
    return (
      <React.StrictMode>
        <Router>
          <App />
        </Router>
      </React.StrictMode>
    );
  };

  root.render(<Root />);
} else {
  // If root is already created, just update the existing root
  const Root = () => {
    return (
      <React.StrictMode>
        <Router>
          <App />
        </Router>
      </React.StrictMode>
    );
  };

  // Use the existing root container to update the rendering
  rootElement._reactRootContainer.render(<Root />);
}
//For eliminating warnings