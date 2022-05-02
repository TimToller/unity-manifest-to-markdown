import React, { useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Typography } from "@mui/material";
const DropZone = (props: { stateChanger: any }) => {
	const [isHovering, setIsHovering] = useState<boolean>(false);
	function handleDrop(e: any) {
		e.preventDefault();
		e.stopPropagation();
		const file = e.dataTransfer.files[0];
		setIsHovering(false);
		handleFile(file);
	}
	function handleFile(file: any) {
		const reader = new FileReader();
		reader.onload = () => {
			const json = JSON.parse(reader.result as string);
			props.stateChanger(json);
		};
		reader.readAsText(file);
	}

	return (
		<div
			className={`dropZone ${isHovering ? "hovering" : ""}`}
			onDrop={(e) => handleDrop(e)}
			onDragLeave={() => setIsHovering(false)}
			onDragOver={(e) => {
				let unknownEvent = e as unknown;
				let event = unknownEvent as Event;
				setIsHovering(true);
				event.stopPropagation();
				event.preventDefault();
			}}
			onClick={() => {
				let input = document.createElement("input");
				input.type = "file";
				input.accept = "application/json";
				input.onchange = (e) => {
					if (!input.files) return;
					const file = input.files[0];
					handleFile(file);
				};
				input.click();
			}}>
			<div>
				<Typography variant="h6" className="dropText" align="center">
					Drop your manifest.json file here!
				</Typography>
				<UploadFileIcon fontSize="large" />
				<Typography variant="subtitle1" align="center">
					(or click to upload)
				</Typography>
			</div>
		</div>
	);
};

export default DropZone;
