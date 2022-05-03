import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	FormControlLabel,
	Paper,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SyntaxHighlighter from "react-syntax-highlighter";
import { tomorrowNightBlue } from "react-syntax-highlighter/dist/esm/styles/hljs";
import axios from "axios";

const OutputDisplay = (props: { manifest: any }) => {
	const { manifest } = props;
	const headers = ["Package", "Publisher", "Version"];
	const [data, setData] = useState<
		{ name: string; publisher: string; version: any }[]
	>([]);
	const [markdown, setMarkdown] = useState<string>("");
	const [includeBuiltIn, setIncludeBuiltIn] = useState<boolean>(false);

	useEffect(() => {
		convertManifestToMarkdown(manifest);
	}, [manifest, includeBuiltIn]);

	const convertManifestToMarkdown = (manifest: any) => {
		let { dependencies } = manifest;
		if (!dependencies) return "";
		axios
			.all(
				Object.keys(dependencies)
					.filter(
						(e) =>
							!e.startsWith("com.unity.modules") &&
							!e.startsWith("com.unity.ugui")
					)
					.map((key) =>
						axios.get(`https://unity-packages-proxy.vercel.app/api/${key}`)
					)
			)
			.then(
				axios.spread((...responses) => {
					let data = responses.map((response) => {
						let { data } = response;
						return data;
					});
					console.log(data);
				})
			);
		// if (!includeBuiltIn)
		// 	newData = newData.filter(
		// 		(e) => e.name.split(".")[0] !== "modules" || e.publisher !== "unity"
		// 	);

		// setData(newData);

		// let markdown = "";
		// markdown += `| ${headers.join(" | ")} |\n|:---:|:---:|:---:|\n`;
		// newData.forEach((row) => {
		// 	markdown += `| ${row.name} | ${row.publisher} | ${row.version} |\n`;
		// });
		setMarkdown(markdown);
	};

	return props.manifest.dependencies ? (
		<div className="contentBody">
			<FormControlLabel
				className="switchBuiltIn"
				control={
					<Switch
						size="medium"
						checked={includeBuiltIn}
						onChange={() => {
							setIncludeBuiltIn(!includeBuiltIn);
						}}
					/>
				}
				label="Include Unity built in Packages"
			/>
			<Button
				variant="contained"
				className="copyButton"
				size="large"
				onClick={() => {
					navigator.clipboard.writeText(markdown);
				}}>
				Copy Markdown
			</Button>
			<div className="previewTable">
				<Accordion>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography>Preview Table</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<TableContainer component={Paper}>
							<Table sx={{ minWidth: 650 }} aria-label="simple table">
								<TableHead>
									<TableRow>
										{headers.map((header) => (
											<TableCell key={header}>{header}</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{data.map((row: any) => (
										<TableRow
											key={row.name}
											sx={{
												"&:last-child td, &:last-child th": { border: 0 },
											}}>
											<TableCell component="th" scope="row">
												{row.name}
											</TableCell>
											<TableCell>{row.publisher}</TableCell>
											<TableCell>{row.version}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</AccordionDetails>
				</Accordion>
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
	) : (
		<div className="contentBody">
			<Typography variant="h6" align="center">
				Add a manifest file to get started!
			</Typography>
		</div>
	);
};

export default OutputDisplay;
