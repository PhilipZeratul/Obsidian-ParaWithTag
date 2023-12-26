import { TFile } from 'obsidian';
import { atom } from 'recoil';

export const activeFile = atom({
	key: 'fileTreeActiveFile',
	default: null as unknown as TFile,
	dangerouslyAllowMutability: true,
});
