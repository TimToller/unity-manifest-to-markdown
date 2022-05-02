import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SyntaxHighlighter from "react-syntax-highlighter";
import { tomorrowNightBlue } from "react-syntax-highlighter/dist/esm/styles/hljs";

const OutputDisplay = (props: { manifest: any }) => {
	const { manifest } = props;
	const headers = ["Package Name", "Publisher", "Version"];

	const convertManifestToMarkdown = (manifest: any) => {
		let { dependencies } = manifest;
		let markdown = "";
		markdown += `| ${headers.join(" | ")} |\n|:---:|:---:|:---:|\n`;
		for (const key in dependencies) {
			if (dependencies.hasOwnProperty(key)) {
				const version = dependencies[key];
				let row = [];
				let packageID = key.split(".");
				//package name
				row.push(packageID.slice(2).join("."));
				//publisher
				row.push(packageID.slice(0, 2).join("."));
				//version
				row.push(version);

				markdown += `| ${row.join(" | ")} |\n`;
			}
		}
		return markdown;
	};
	const markdown = convertManifestToMarkdown(manifest);

	return (
		<div>
			{props.manifest.dependencies && (
				<div>
					<div className="previewTable">
						{/* <TableContainer component={Paper}>
							<Table sx={{ minWidth: 650 }} aria-label="simple table">
								<TableHead>
									<TableRow>
										{headers.map((header) => (
											<TableCell key={header}>{header}</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{rows.map((row) => (
										<TableRow
											key={row.name}
											sx={{
												"&:last-child td, &:last-child th": { border: 0 },
											}}>
											<TableCell component="th" scope="row">
												{row.name}
											</TableCell>
											<TableCell align="right">{row.calories}</TableCell>
											<TableCell align="right">{row.fat}</TableCell>
											<TableCell align="right">{row.carbs}</TableCell>
											<TableCell align="right">{row.protein}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer> */}
					</div>
					<div className="previewData">
						<Accordion>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								<Typography>Preview Markdown</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<SyntaxHighlighter
									language="markdown"
									className="codeBlock"
									style={tomorrowNightBlue}
									showLineNumbers={false}>
									{markdown}
								</SyntaxHighlighter>
							</AccordionDetails>
						</Accordion>
					</div>
					<div className="previewData">
						<Accordion>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								<Typography>Preview JSON</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<SyntaxHighlighter
									className="codeBlock"
									language="json"
									style={tomorrowNightBlue}
									showLineNumbers={false}>
									{JSON.stringify(manifest, null, 2)}
								</SyntaxHighlighter>
							</AccordionDetails>
						</Accordion>
					</div>
				</div>
			)}
		</div>
	);
};

export default OutputDisplay;
