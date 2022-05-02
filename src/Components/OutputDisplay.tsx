import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Typography,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/hljs";

const OutputDisplay = (props: { manifest: any }) => {
	return (
		<div>
			{props.manifest.dependencies && (
				<div className="previewJSON">
					<Accordion>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography>Preview JSON</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<SyntaxHighlighter
								language="json"
								style={vs}
								showLineNumbers={true}>
								{JSON.stringify(props.manifest, null, 2)}
							</SyntaxHighlighter>
						</AccordionDetails>
					</Accordion>
				</div>
			)}
		</div>
	);
};

export default OutputDisplay;
