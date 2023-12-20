import React, {useMemo, useState, useRef, useEffect} from "react";
import {App} from "obsidian";
import {useSpring, animated, a} from "@react-spring/web";
import useMeasure from 'react-use-measure'

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
	
	return (
		<>
			<div className={"tree-item nav-folder mod-root"}>
				<div className={"tree-item-self nav-folder-title"}>
					<div className={"tree-item-inner nav-folder-title-content"}>
						{folderTreeData.name}
					</div>
				</div>
				<NavTree navTreeDatas={folderTreeData.children} isOpen={true}/>
			</div>
		</>
	);
}

function usePrevious<T>(value: T) {
	const ref = useRef<T>()
	useEffect(() => void (ref.current = value), [value])
	return ref.current
}

function NavTree({navTreeDatas, isOpen}: { navTreeDatas: NavTreeData[], isOpen: boolean }) {
	const folderDatas = navTreeDatas.filter(x => !x.isFile);
	const fileDatas = navTreeDatas.filter(x => x.isFile);

	// TODO: Add transition animation
	const previous = usePrevious(isOpen)
	const [ref, { height: viewHeight }] = useMeasure()
	const { height, opacity, y } = useSpring({
		from: { height: 0, opacity: 0, y: 0 },
		to: {
			height: isOpen ? viewHeight : 0,
			opacity: isOpen ? 1 : 0,
			y: isOpen ? 0 : 20,
		},
	})
	
	return (
		<>
			<animated.div className={"tree-item-children nav-folder-children"} style={{
				opacity,
				height: isOpen  ? 100 : 50,
			}}>
				<div style={{height: "0.1px", marginBottom: "0px"}} />
				{folderDatas.map((node) => (
					<NavFolder folderData={node} key={node.id}/>
				))}
				{fileDatas.map((node) => (
					<NavFile fileData={node} key={node.id}/>
				))}
				<div ref={ref} />
			</animated.div>
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
			<div className={showChildren? "tree-item nav-folder" : "tree-item nav-folder is-collapsed"}>
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
				{showChildren && <NavTree navTreeDatas={folderData.children} isOpen={showChildren}/>}
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
