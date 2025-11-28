import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Controller from "./Controller.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Controller />
	</StrictMode>
);
