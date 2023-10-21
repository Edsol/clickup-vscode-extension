
import path = require('path');
import { TreeItem, TreeItemCollapsibleState, ThemeIcon } from 'vscode';
import { Tracking } from '../../types';

export class TrackingItem extends TreeItem {
    constructor(
        public trackingItem: Tracking,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(trackingItem.user.username, collapsibleState);
        this.id = "" + trackingItem.time;
        this.iconPath = ThemeIcon.Folder;
    }
    contextValue = 'trackingItem';
}