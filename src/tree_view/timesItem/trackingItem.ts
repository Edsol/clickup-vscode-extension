
import path = require('path');
import { TreeItem, TreeItemCollapsibleState, window } from 'vscode';
import { Tracking } from '../../types';

export class TrackingItem extends TreeItem {
    constructor(
        public trackingItem: Tracking,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(trackingItem.user.username, collapsibleState);
        this.id = "" + trackingItem.time;
        this.iconPath = {
            light: path.join(__dirname, '..', '..', '..', '..', 'resources', 'folderItem', 'documents.png'),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'folderItem', 'documents_white.png')
        };
    }
    contextValue = 'trackingItem';
}