import {IconName, ItemView, WorkspaceLeaf} from "obsidian";
import {createRoot, Root} from "react-dom/client";
import {StrictMode} from "react";
import {ReactView} from "./FolderView";

export const PARA_WITH_TAGS_VIEW_TYPE = "para_with_tag_view";

export class ParaWithTagsView extends ItemView {
	root: Root | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return PARA_WITH_TAGS_VIEW_TYPE;
	}

	getDisplayText(): string {
		return "PARA With Tags";
	}

	getIcon(): IconName {
		return "layout-list";
	}

	async onOpen() {
		const fileNames = this.loadFiles();
		
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<StrictMode>
				<ReactView fileNames={fileNames}/>
			</StrictMode>
		);

	}

	async onClose() {
		this.root?.unmount();
	}

	loadFiles() : string[] {
		// TODO: Deal with other files like Excalidraw
		const files = this.app.vault.getMarkdownFiles();
		let fileNames : string[] = [];
		for (let i = 0; i < files.length; i++)
		{
			fileNames[i] = files[i].basename;
			let frontMatter = this.app.metadataCache.getFileCache(files[i])?.frontmatter;
			if (frontMatter) {
				console.log(frontMatter["PARA"]);
			}
		}
		return fileNames;
	}
}
