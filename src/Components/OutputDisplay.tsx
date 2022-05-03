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
import builtins from "./builtins.json";

const API = "https://unity-packages-proxy.vercel.app/api/";
interface dependency {
	name: string;
	id: string;
	version: string;
}

const OutputDisplay = (props: { manifest: any }) => {
	const { manifest } = props;
	const headers = ["Package Name", "Package ID", "Version"];
	const [data, setData] = useState([]);
	const [markdown, setMarkdown] = useState<string>("");
	const [includeBuiltIn, setIncludeBuiltIn] = useState<boolean>(false);

	useEffect(() => {
		convertManifestToMarkdown(manifest);
	}, [manifest, includeBuiltIn]);

	const convertManifestToMarkdown = (manifest: any) => {
		let { dependencies } = manifest;
		if (!dependencies) return "";
		let newData: any = [];

		Object.keys(dependencies).forEach((dep) => {
			//check built-ins
			let moduleName = builtins[dep as keyof typeof builtins];

			//ugui is an exception - it's technically not a built in module, but doesn't have an api endpoint
			//that's why it's in the builtins.json anyway...
			if (moduleName && (includeBuiltIn || dep === "com.unity.ugui")) {
				newData.push({
					name: moduleName,
					id: dep,
					version: dependencies[dep],
				});
			}
		});

		Promise.allSettled(
			Object.keys(dependencies)
				.filter(
					(p) =>
						/^[\.\d\-pre]+$/g.test(dependencies[p]) &&
						!builtins[p as keyof typeof builtins]
				)
				.map((key) => axios.get(`${API}${key}`))
		).then((results) => {
			results.forEach((result) => {
				if (result.status === "fulfilled" && result?.value?.data) {
					const { data } = result.value;
					const version = data.versions[dependencies[data.name]];
					newData.push({
						name: version.displayName || data.name,
						id: version.name,
						version: version.version,
					});
				}
			});

			setData(
				newData.sort((a: dependency, b: dependency) =>
					a.name.localeCompare(b.name)
				)
			);

			let markdown = "";
			markdown += `| ${headers.join(" | ")} |\n|:---:|:---:|:---:|\n`;
			newData.forEach((row: dependency) => {
				markdown += `| ${row.name} | ${row.id} | ${row.version} |\n`;
			});
			setMarkdown(markdown);
		});
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
				label="Include Built-in packages (Don't appear in Package Manager, but in manifest)"
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
											<TableCell>{row.id}</TableCell>
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
