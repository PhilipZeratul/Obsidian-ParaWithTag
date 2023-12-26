import {App, TFile} from "obsidian";
import React, {useMemo, useState, useRef, useEffect} from "react";
import {useSpring, animated, a} from "@react-spring/web";
import useMeasure from 'react-use-measure'
import {useDropzone} from 'react-dropzone';
import { useRecoilState } from 'recoil';
import * as RecoilState from 'Sources/Recoil/RecoilState'; 

interface NavTreeData {
	id: string;
	name: string;
	isFile: boolean;
	children: NavTreeData[];
	file?: TFile;
}

export function FolderView({app}: { app: App }) {
	let navTreeData: NavTreeData = {
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
		let currentData = navTreeData.children[4]; // Default to Not PARA.
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
					currentData = navTreeData.children[0];
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

		let fileData: NavTreeData = {
			id: currentData.children.length.toString(),
			name: files[i].basename,
			isFile: true,
			children: [],
			file: files[i]
		}
		currentData.children.push(fileData);
	}

	return (
		<>
			<div className={"tree-item nav-folder mod-root"}>
				<div className={"tree-item-self nav-folder-title"}>
					<div className={"tree-item-inner nav-folder-title-content"}>
						{navTreeData.name}
					</div>
				</div>
				<NavTree navTreeDatas={navTreeData.children} app={app}/>
			</div>
		</>
	);
}

function usePrevious<T>(value: T) {
	const ref = useRef<T>()
	useEffect(() => void (ref.current = value), [value])
	return ref.current
}

function NavTree({navTreeDatas, app}: { navTreeDatas: NavTreeData[], app: App }) {
	const folderDatas = navTreeDatas.filter(x => !x.isFile);
	const fileDatas = navTreeDatas.filter(x => x.isFile);

	return (
		<>
			<div className={"tree-item-children nav-folder-children"}>
				<div style={{height: "0.1px", marginBottom: "0px"}}/>
				{folderDatas.map((node) => (
					<NavFolder folderData={node} key={node.id} app={app}/>
				))}
				{fileDatas.map((node) => (
					<NavFile fileData={node} key={node.id} app={app}/>
				))}
			</div>
		</>
	);
}

function NavFolder({folderData, app}: { folderData: NavTreeData, app:App }) {
	const [isOpen, setIsOpen] = useState(true);
	const [ref, {height: viewHeight}] = useMeasure()
	const {height} = useSpring({
		from: {height: 0},
		to: {
			height: isOpen ? viewHeight : 0
		},
		config: {
			duration: 100
		}
	})

	const handleClick = () => {
		setIsOpen(!isOpen);
		console.log(viewHeight)
	};

	return (
		<>
			<div className={isOpen ? "tree-item nav-folder" : "tree-item nav-folder is-collapsed"}>
				<div className={"tree-item-self is-clickable mod-collapsible nav-folder-title"} draggable={true}
					 onClick={handleClick}>
					<div
						className={isOpen ? "tree-item-icon collapse-icon nav-folder-collapse-indicator" : "tree-item-icon collapse-icon nav-folder-collapse-indicator is-collapsed"}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
							 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
							 className="svg-icon right-triangle">
							<path d="M3 8L12 17L21 8"></path>
						</svg>
					</div>
					<div className={"tree-item-inner nav-folder-title-content"}>
						{folderData.name}
					</div>
				</div>
				<animated.div style={{
					height: height, overflow: 'hidden',
				}} >
					<div ref={ref}>
					{isOpen && <NavTree navTreeDatas={folderData.children} app={app}/>}
					</div>
				</animated.div>
			</div>
		</>
	)
}

function NavFile({fileData, app}: { fileData: NavTreeData, app: App }) {
	const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
	const [activeFile, setActiveFile] = useRecoilState(RecoilState.activeFile);

	let file = fileData.file as TFile;
	
	// TODO: Multi-select support. Shift click & Alt click.
	const openFile = (fileData: NavTreeData, e: React.MouseEvent) => {
		if (file !== undefined) {
			let newLeaf = (e.ctrlKey || e.metaKey) && !(e.shiftKey || e.altKey);
			let leafBySplit = (e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey);
			
			let leaf = app.workspace.getLeaf(newLeaf);
			if (leafBySplit) leaf = app.workspace.createLeafBySplit(leaf, 'vertical');
			app.workspace.setActiveLeaf(leaf);
			leaf.openFile(file, {eState: {focus: true}}).then(r => setActiveFile(file));
		}
	};
	
	return (
		<>
			<div className={"tree-item nav-file"}>
				<div className={"tree-item-self is-clickable nav-file-title" + (activeFile === file ? ' is-active': '')} 
					 draggable={true} onClick={(e) => openFile(fileData, e)}>
					<div className={"tree-item-inner nav-file-title-content"}>{fileData.name}</div>
				</div>
			</div>
		</>
	)
}
