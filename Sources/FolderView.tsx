import React, {useMemo, useState} from "react";
import {App} from "obsidian";

function NavFile({fileName}: { fileName: string }) {
	return <div className={"nav-file-title"}>{fileName}</div>;
}

interface FolderTreeData {
	id: string;
	name: string;
	children?: FolderTreeData[];
}

function TreeView({folderTreeData}: { folderTreeData: FolderTreeData[] | undefined }) {
	return (
		<ul>
			{folderTreeData?.map((node) => (
				<TreeNode node={node} key={node.id}/>
			))}
		</ul>
	);
}

function TreeNode({node}: { node: FolderTreeData }) {
	const {children, name} = node;

	const [showChildren, setShowChildren] = useState(true);

	const handleClick = () => {
		setShowChildren(!showChildren);
	};
	return (
		<>
			<div onClick={handleClick} style={{marginBottom: "10px"}}>
				<span>{name}</span>
			</div>
			<ul style={{paddingLeft: "10px", borderLeft: "1px solid black"}}>
				{showChildren && <TreeView folderTreeData={children}/>}
			</ul>
		</>
	);
}

export function FolderView({app}: { app: App }) {


	let folderTreeData: FolderTreeData = {
		id: "root",
		name: app.vault.getName().toUpperCase(),
		children: [
			{
				id: "project",
				name: "Project",
				children: []
			},
			{
				id: "area",
				name: "Area",
				children: []
			},
			{
				id: "resource",
				name: "Resource",
				children: []
			},
			{
				id: "archive",
				name: "Archive",
				children: []
			}
		]
	}

	// Populate folderTree.
	// TODO: Deal with other files like Excalidraw
	const files = this.app.vault.getMarkdownFiles();
	let fileNames: string[] = [];

	for (let i = 0; i < files.length; i++) {
		let paraProperty: string | null = null;

		fileNames[i] = files[i].basename;
		let frontMatter = this.app.metadataCache.getFileCache(files[i])?.frontmatter;
		if (frontMatter) {
			paraProperty = frontMatter["PARA"];
		}
		if (paraProperty) {

		}
	}


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

	const data: FolderTreeData[] = [
		folderTreeData
	];
	
	return (
		<>
			<div className={"nav-folder-title"}>Hello, React!</div>
			<div>
				{fileNameButtons}
			</div>
			<div>
				<TreeView folderTreeData={data}/>
			</div>
		</>
	);
}
