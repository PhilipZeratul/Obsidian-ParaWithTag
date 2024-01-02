import {IconName, ItemView, WorkspaceLeaf} from "obsidian";
import {createRoot, Root} from "react-dom/client";
import {StrictMode} from "react";
import {FolderView} from "./FolderView";
import {RecoilRoot} from 'recoil';
import {DragDropContext} from '@hello-pangea/dnd';

export const PARA_WITH_TAGS_VIEW_TYPE = "para-with-tag-view";

export class ParaWithPropertiesView extends ItemView {
	root: Root | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return PARA_WITH_TAGS_VIEW_TYPE;
	}

	getDisplayText(): string {
		return "PARA With Properties";
	}

	getIcon(): IconName {
		return "layout-list";
	}

	async onOpen() {
		function onDragEnd() {
			// the only one that is required
			console.log("onDragEnd");
		}
		
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<StrictMode>
				<RecoilRoot>
					<DragDropContext onDragEnd={onDragEnd}>
						<FolderView app={this.app}/>
					</DragDropContext>
				</RecoilRoot>
			</StrictMode>
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
