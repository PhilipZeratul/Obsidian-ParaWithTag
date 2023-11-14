import React, {useMemo} from "react";

function NavFile({fileName}: { fileName: string }) {
	return <div className="nav-file-title">{fileName}</div>;
}

export function FolderView({fileNames}: { fileNames: string[] }) {
	const fileNameButtons = useMemo(() =>
		fileNames.map((fileName, index) => {
				return (
					<div key={index}>
						<NavFile fileName={fileName}/>
					</div>
				)
			}
		), [fileNames]
	)

	return (
		<>
			<h4>Hello, React!</h4>
			<div>
				<ol>{fileNameButtons}</ol>
			</div>
		</>
	);
}
