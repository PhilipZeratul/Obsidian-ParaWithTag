import React, {useMemo, useState} from "react";
import {App} from "obsidian";

interface NavTreeData {
	id: string;
	name: string;
	isFile: boolean;
	children: NavTreeData[];
}

export function FolderView({app}: { app: App }) {
	let folderTreeData: NavTreeData = {
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
			},
			{
				id: "not para",
				name: "Not PARA",
				isFile: false,
				children: []
			}
		]
	}

	// Populate folderTree.
	// TODO: Deal with other files like Excalidraw
	const files = this.app.vault.getMarkdownFiles();

	// TODO: Sort by name
	for (let i = 0; i < files.length; i++) {
		let paraProperty: string | null = null;
		let currentData = folderTreeData.children[4];

		// TODO: Use app.FileManager.processfrontmatter()
		let frontMatter = this.app.metadataCache.getFileCache(files[i])?.frontmatter;
		if (frontMatter) {
			paraProperty = frontMatter["PARA"];
		}
		if (paraProperty) {
			// Add folder structure.
			let folderStructure: string[] = paraProperty.split("/");
			
			switch (folderStructure[0]) {
				case "Project":
					currentData = folderTreeData.children[0];
					for (let j = 1; j < folderStructure.length; j++) {
						let folderData = currentData.children.find(x => x.name == folderStructure[j]);
						if (!folderData) {
							folderData = {
								id: currentData.children.length.toString(),
								name: folderStructure[j],
								isFile: false,
								children: []
							}
							currentData.children.push(folderData);
						}
						currentData = folderData;
					}
					break;
				case "Area":
					break;
				case "Resource":
					break;
				case "Archive":
					break;
				default:
					break;
			}
		}

		let fileData: NavTreeData= {
			id: currentData.children.length.toString(),
			name: files[i].basename,
			isFile: true,
			children: []
		}
		currentData.children.push(fileData);
	}

	console.log(folderTreeData);

	// TODO: <div style is not correct, need to re-design NavTree.
	return (
		<>
			<div className={"tree-item nav-folder mod-root"}>
				<div className={"tree-item-self nav-folder-title"}>
					<div className={"tree-item-inner nav-folder-title-content"}>
						{folderTreeData.name}
					</div>
				</div>
				<NavTree navTreeDatas={folderTreeData.children}/>
			</div>
		</>
	);
}

function NavTree({navTreeDatas}: { navTreeDatas: NavTreeData[] }) {
	const folderDatas = navTreeDatas.filter(x => !x.isFile);
	const fileDatas = navTreeDatas.filter(x => x.isFile);

	return (
		<>
			<div className={"tree-item-children nav-folder-children"}>
				<div style={{height: "0.1px", marginBottom: "0px"}} />
				{folderDatas.map((node) => (
					<NavFolder folderData={node} key={node.id}/>
				))}
				{fileDatas.map((node) => (
					<NavFile fileData={node} key={node.id}/>
				))}
			</div>
		</>
	);
}

function NavFolder({folderData}: { folderData: NavTreeData }) {
	const [showChildren, setShowChildren] = useState(true);

	const handleClick = () => {
		setShowChildren(!showChildren);
	};
	
	return (
		<>
			<div className={"tree-item nav-folder"}>
				<div className={"tree-item-self is-clickable mod-collapsible nav-folder-title"} draggable={true}
					 onClick={handleClick}>
					<div className= {showChildren? "tree-item-icon collapse-icon nav-folder-collapse-indicator" : "tree-item-icon collapse-icon nav-folder-collapse-indicator is-collapsed"}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon right-triangle">
							<path d="M3 8L12 17L21 8"></path>
						</svg>
					</div>
					<div className={"tree-item-inner nav-folder-title-content"}>
						{folderData.name}
					</div>
				</div>
				{showChildren && <NavTree navTreeDatas={folderData.children}/>}
			</div>
		</>
	)
}

function NavFile({fileData}: { fileData: NavTreeData }) {
	return (
		<>
			<div className={"tree-item nav-file"}>
				<div className={"tree-item-self is-clickable nav-file-title"} draggable={true}>
					<div className={"tree-item-inner nav-file-title-content"}>{fileData.name}</div>
				</div>
			</div>
		</>
	)
}
