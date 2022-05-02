import React, { useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Typography } from "@mui/material";
const DropZone = (props: { stateChanger: any }) => {
	const [isHovering, setIsHovering] = useState<boolean>(false);
	function handleDrop(e: any) {
		e.preventDefault();
		e.stopPropagation();
		const file = e.dataTransfer.files[0];
		console.log(file);

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
			}}>
			<div>
				<Typography variant="h6" className="dropText" align="center">
					Drop your manifest.json file here!
				</Typography>
				<UploadFileIcon fontSize="large" />
			</div>
		</div>
	);
};

export default DropZone;
