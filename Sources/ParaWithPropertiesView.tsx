import {IconName, ItemView, WorkspaceLeaf} from "obsidian";
import {createRoot, Root} from "react-dom/client";
import {StrictMode, useId} from "react";
import {FolderView} from "./FolderView";
import {RecoilRoot} from 'recoil';
import {NavTreeData} from "./NavTreeData";
import { v4 as uuidv4 } from 'uuid';

export const PARA_WITH_PROPERTIES_TYPE = "para-with-properties-view";

export class ParaWithPropertiesView extends ItemView {
	root: Root | null = null;
	
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return PARA_WITH_PROPERTIES_TYPE;
	}

	getDisplayText(): string {
		return "PARA With Properties";
	}

	getIcon(): IconName {
		return "layout-list";
	}

	async onOpen() {
		let navTreeData: NavTreeData = {
			id: uuidv4(),
			name: this.app.vault.getName(),
			isFile: false,
			children: [
				{
					id: uuidv4(),
					name: "Project",
					isFile: false,
					children: []
				},
				{
					id: uuidv4(),
					name: "Area",
					isFile: false,
					children: []
				},
				{
					id: uuidv4(),
					name: "Resource",
					isFile: false,
					children: []
				},
				{
					id: uuidv4(),
					name: "Archive",
					isFile: false,
					children: []
				},
				{
					id: uuidv4(),
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
			// TODO: Change frontmatter property.
			// How to await it in an Element?
			await this.app.fileManager.processFrontMatter(files[i], (fm) => {

			})
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
									id: uuidv4(),
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
				id: uuidv4(),
				name: files[i].basename,
				isFile: true,
				children: [],
				file: files[i]
			}
			currentData.children.push(fileData);
		}
		
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<StrictMode>
				<RecoilRoot>
					<FolderView navTreeData={navTreeData}/>
				</RecoilRoot>
			</StrictMode>
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
