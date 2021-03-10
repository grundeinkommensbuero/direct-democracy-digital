import React from "react";
import ReactDOM from "react-dom";
import { App, AuthProvider } from "admin-direct-democracy";

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);
