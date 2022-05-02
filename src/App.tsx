import React, { useState } from "react";
import logo from "./logo.svg";
import "./styles/main.scss";
import { createTheme, ThemeProvider, Typography } from "@mui/material";
import DropZone from "./Components/DropZone";
import OutputDisplay from "./Components/OutputDisplay";
import blue from "@mui/material/colors/blue";

function App() {
	const [manifest, setManifest] = useState({});

	const darkTheme = createTheme({
		palette: {
			mode: "dark",
		},
	});

	return (
		<ThemeProvider theme={darkTheme}>
			<div className="App">
				<div className="mainTop">
					<div>
						<Typography variant="h3" className="titleBar" align="center">
							Unity manifest JSON to Markdown table converter
						</Typography>
						<Typography
							variant="subtitle1"
							className="subtitleBar"
							align="center">
							Open your Unity project's manifest.json file and copy the JSON
							into the text area below.
						</Typography>
					</div>
					<div>
						<DropZone stateChanger={setManifest} />
					</div>
				</div>
				<div className="contentBody">
					<OutputDisplay manifest={manifest} />
				</div>
			</div>
		</ThemeProvider>
	);
}

export default App;
