import React from "react";
const DropZone = (props: { stateChanger: any }) => {
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
			className="dropZone"
			onDrop={(e) => handleDrop(e)}
			onDragOver={(e) => {
				let unknownEvent = e as unknown;
				let event = unknownEvent as Event;
				event.stopPropagation();
				event.preventDefault();
			}}>
			<div>Drop your manifest.json file here!</div>
		</div>
	);
};

export default DropZone;
