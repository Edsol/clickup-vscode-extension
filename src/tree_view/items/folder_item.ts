import path = require('path');
import { TreeItem, TreeItemCollapsibleState, window } from 'vscode';
import { Folder } from '../../types';

export class FolderItem extends TreeItem {
    constructor(
        public folder: Folder,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(folder.name, collapsibleState);
        this.id = folder.id;
        this.iconPath = {
            light: path.join(__dirname, '..', '..', '..', '..', 'resources', 'folderItem', 'documents.png'),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'folderItem', 'documents_white.png')
        };
    }
    contextValue = 'folderItem';
}