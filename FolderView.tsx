import React, {useMemo} from "react";

function NavFile({fileName}: { fileName: string }) {
	return <div className="tree-item-inner.nav-folder-title-content">{fileName}</div>;
}

export function ReactView({fileNames}: { fileNames: string[] }) {
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
