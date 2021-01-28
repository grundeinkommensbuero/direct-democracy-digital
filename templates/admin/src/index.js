import React from "react";
import ReactDOM from "react-dom";
import { App, AuthProvider } from "@xbge/admin-panel";

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);
