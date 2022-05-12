import React from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

document.documentElement.className = "darkTheme";
console.log(document.documentElement);
ReactDOM.render(
	<AuthProvider>
		<App />
	</AuthProvider>,

	document.getElementById("root")
);
