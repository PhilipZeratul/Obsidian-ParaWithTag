import {TFile} from "obsidian";

export interface NavTreeData {
	id: string;
	name: string;
	isFile: boolean;
	children: NavTreeData[];
	file?: TFile;
}
