import React, {useMemo, useState} from "react";
import {App} from "obsidian";

function NavFile({fileName}: { fileName: string }) {
	return <div className={"nav-file-title"}>{fileName}</div>;
}

function NavFolder({folderTreeData}: { folderTreeData: FolderTreeData }) {
	const [showChildren, setShowChildren] = useState(true);

	const handleClick = () => {
		setShowChildren(!showChildren);
	};

	return (
		<>
			<div className={"nav-folder-title"} onClick={handleClick}>{folderTreeData.name}</div>
			<ul>
				{showChildren && <TreeView folderTreeDatas={folderTreeData.children}/>}
			</ul>
		</>
	)
}

interface FolderTreeData {
	id: string;
	name: string;
	isFile: boolean;
	children?: FolderTreeData[];
}

function TreeView({folderTreeDatas}: { folderTreeDatas: FolderTreeData[] | undefined }) {
	return (
		<div>
			{folderTreeDatas?.map((node) => (
				<TreeNode folderTreeData={node} key={node.id}/>
			))}
		</div>
	);
}

function TreeNode({folderTreeData}: { folderTreeData: FolderTreeData }) {
	const {children, name} = folderTreeData;

	if (folderTreeData.isFile) {
		return <NavFile fileName={folderTreeData.name}/>
	} else {
		return <NavFolder folderTreeData={folderTreeData}/>
	}
}

export function FolderView({app}: { app: App }) {


	let folderTreeData: FolderTreeData = {
		id: "root",
		name: app.vault.getName(),
		isFile: false,
		children: [
			{
				id: "project",
				name: "Project",
				isFile: false,
				children: []
			},
			{
				id: "area",
				name: "Area",
				isFile: false,
				children: []
			},
			{
				id: "resource",
				name: "Resource",
				isFile: false,
				children: []
			},
			{
				id: "archive",
				name: "Archive",
				isFile: false,
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

	return (
		<>
			<div className={"tree-item nav-folder mod-root"}>
				<div className={"tree-item-self nav-folder-title"}>
					<div className={"tree-item-inner nav-folder-title-content"}>
						{folderTreeData.name}
					</div>
				</div>
				<div>
					<TreeView folderTreeDatas={folderTreeData.children}/>
				</div>
			</div>
		</>
	);
}
