function File({fileName}: { fileName: string }) {
	return <button className="file">{fileName}</button>;
}

export function ReactView({fileNames}: { fileNames: string[] }) {
	const fileNameButtons = fileNames.map((fileName, index) => {
			return (
				<li>
					<File fileName={fileName}/>
				</li>
			)
		}
	);

	return (
		<>
			<h4>Hello, React!</h4>
			<div>
				<ol>{fileNameButtons}</ol>
			</div>
		</>
	);
}
