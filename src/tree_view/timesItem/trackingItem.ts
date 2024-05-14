
import path = require('path');
import { TreeItem, TreeItemCollapsibleState, ThemeIcon } from 'vscode';
import { Tracking } from '../../types';
import { formatDuration } from '../../lib/timer';

export class TrackingItem extends TreeItem {
    constructor(
        public trackingItem: Tracking,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        const title = `${trackingItem.user.username} (${formatDuration(trackingItem.time)})`;
        super(title, collapsibleState);
        this.id = `${trackingItem.time}`;
        this.iconPath = ThemeIcon.Folder;
    }
    contextValue = 'trackingItem';
}