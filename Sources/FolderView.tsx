import {App, TFile} from "obsidian";
import React, {useState, useId} from "react";
import {useSpring, animated} from "@react-spring/web";
import useMeasure from 'react-use-measure'
import {useRecoilState} from 'recoil';
import * as RecoilState from 'Sources/Recoil/RecoilState';
import {DragDropContext, Draggable, DragStart, Droppable, DropResult, ResponderProvided} from '@hello-pangea/dnd';

interface NavTreeData {
	id: string;
	name: string;
	isFile: boolean;
	children: NavTreeData[];
	file?: TFile;
}

export function FolderView({app}: { app: App }) {
	let navTreeData: NavTreeData = {
		id: useId(),
		name: app.vault.getName(),
		isFile: false,
		children: [
			{
				id: useId(),
				name: "Project",
				isFile: false,
				children: []
			},
			{
				id: useId(),
				name: "Area",
				isFile: false,
				children: []
			},
			{
				id: useId(),
				name: "Resource",
				isFile: false,
				children: []
			},
			{
				id: useId(),
				name: "Archive",
				isFile: false,
				children: []
			},
			{
				id: useId(),
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
								id: useId(),
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
			id: useId(),
			name: files[i].basename,
			isFile: true,
			children: [],
			file: files[i]
		}
		currentData.children.push(fileData);
	}

	function findChildById(data: NavTreeData, id: string): NavTreeData | undefined {
		// Check the current item's ID
		if (data.id === id) {
			return data;
		}

		// Recursively search within children
		for (const child of data.children) {
			const foundChild = findChildById(child, id);
			if (foundChild) {
				return foundChild;
			}
		}

		// If not found, return undefined
		return undefined;
	}
	
	function onDragStart (start: DragStart, provided: ResponderProvided) {
		let dragData = findChildById(navTreeData, start.draggableId);
		console.log("onDragStart: id = " + start.draggableId + " name = " + dragData?.name);
	}
	
	function onDragEnd(result: DropResult, provided: ResponderProvided) {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		let dropData = findChildById(navTreeData, result.destination.droppableId);
		console.log("onDragEnd: id = " + result.destination.droppableId + " name = " + dropData?.name);
	}

	return (
		<DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
			<div className={"tree-item nav-folder mod-root"}>
				<div className={"tree-item-self nav-folder-title"}>
					<div className={"tree-item-inner nav-folder-title-content"}>
						{navTreeData.name}
					</div>
				</div>
				<NavTree navTreeDatas={navTreeData.children} app={app}/>
			</div>
		</DragDropContext>
	);
}

function NavTree({navTreeDatas, app}: { navTreeDatas: NavTreeData[], app: App }) {
	const folderDatas = navTreeDatas.filter(x => !x.isFile);
	const fileDatas = navTreeDatas.filter(x => x.isFile);

	return (
		<>
			<div className={"tree-item-children nav-folder-children"}>
				<div style={{height: "0.1px", marginBottom: "0px"}}/>
				{folderDatas.map((node, index) => (
					<NavFolder folderData={node} key={node.id} app={app} index={index}/>
				))}
				{fileDatas.map((node, index) => (
					<NavFile fileData={node} key={node.id} app={app} index={index}/>
				))}
			</div>
		</>
	);
}

function NavFolder({folderData, app, index}: { folderData: NavTreeData, app: App, index: number }) {
	const [isOpen, setIsOpen] = useState(true);
	const [measureRef, {height: viewHeight}] = useMeasure()
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
	};

	return (
		<Droppable droppableId={folderData.id}>
			{(provided, snapshot) => (
				<div
					className={"tree-item nav-folder" + (isOpen ? "" : " is-collapsed") + (snapshot.isDraggingOver ? " is-being-dragged-over" : "")}
					ref={provided.innerRef}
					{...provided.droppableProps}>

					<div className={"tree-item-self is-clickable mod-collapsible nav-folder-title"}
						 onClick={handleClick}>
						<div
							className={"tree-item-icon collapse-icon nav-folder-collapse-indicator" + (isOpen ? "" : " is-collapsed")}>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
								 fill="none"
								 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
								 className="svg-icon right-triangle">
								<path d="M3 8L12 17L21 8"></path>
							</svg>
						</div>
						<div className={"tree-item-inner nav-folder-title-content"}>
							{folderData.name}
						</div>

					</div>
					<animated.div style={{height: height, overflow: 'hidden'}}>
						<div ref={measureRef}>
							{isOpen && <NavTree navTreeDatas={folderData.children} app={app}/>}
						</div>
					</animated.div>
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	)
}

function NavFile({fileData, app, index}: { fileData: NavTreeData, app: App, index: number }) {
	const [activeFile, setActiveFile] = useRecoilState(RecoilState.activeFile);

	let file = fileData.file as TFile;

	// TODO: Multi-select support. Shift click & Alt click.
	const openFile = (e: React.MouseEvent) => {
		if (file !== undefined) {
			let newLeaf = (e.ctrlKey || e.metaKey) && !(e.shiftKey || e.altKey);
			let leafBySplit = (e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey);

			let leaf = app.workspace.getLeaf(newLeaf);
			if (leafBySplit) leaf = app.workspace.createLeafBySplit(leaf, "vertical");
			app.workspace.setActiveLeaf(leaf);
			leaf.openFile(file, {eState: {focus: true}}).then(r => setActiveFile(file));
		}
	};

	return (
		<Draggable draggableId={fileData.id} index={index} key={useId()}>
			{(provided, snapshot) => (
				<div className={"tree-item nav-file"}
					 ref={provided.innerRef}
					 {...provided.draggableProps}
					 {...provided.dragHandleProps}>
					<div
						className={"tree-item-self is-clickable nav-file-title" + (activeFile === file ? " is-active" : "")}
						onClick={(e) => openFile(e)}>
						<div className={"tree-item-inner nav-file-title-content"}>{fileData.name}</div>
					</div>
				</div>
			)}
		</Draggable>
	)
}
