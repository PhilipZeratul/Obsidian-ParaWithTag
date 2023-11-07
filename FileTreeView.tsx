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
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<StrictMode>
				<ReactView/>
			</StrictMode>
		);

	}

	async onClose() {
		this.root?.unmount();
	}

	async loadFiles() {
		const files = this.app.vault.getMarkdownFiles();


	}	
}
