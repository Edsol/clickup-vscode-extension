import path = require('path');
import { TreeItem, TreeItemCollapsibleState, window } from 'vscode';
import { Folder } from '../../types';
import { FOLDER_ICONAME } from '../../constants';

export class FolderItem extends TreeItem {
    constructor(
        public folder: Folder,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(folder.name, collapsibleState);
        this.id = folder.id;
        this.iconPath = {
            light: path.join(__dirname, '..', '..', '..', '..', 'resources', 'official_icons', 'dark', FOLDER_ICONAME),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'official_icons', 'white', FOLDER_ICONAME)
        };
    }
    contextValue = 'folderItem';
}