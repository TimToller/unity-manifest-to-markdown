import React, { useState } from "react";
import logo from "./logo.svg";
import "./styles/main.scss";
import { createTheme, Link, ThemeProvider, Typography } from "@mui/material";
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
							Go to your Unity Project, open the <span>Packages</span> Folder
							and drag and drop the <span>manifest.json</span> file here.
						</Typography>
					</div>
					<div>
						<DropZone stateChanger={setManifest} />
					</div>
				</div>

				<OutputDisplay manifest={manifest} />
				<footer>
					<Typography variant="subtitle1" align="center">
						Made with ❤️ by{" "}
						<Link
							href="https://github.com/timtoller"
							underline="hover"
							target={"_blank"}>
							Tim Toller
						</Link>
					</Typography>
				</footer>
			</div>
		</ThemeProvider>
	);
}

export default App;
