
import path = require('path');
import { TreeItem, TreeItemCollapsibleState, ThemeIcon } from 'vscode';
import { Tracking } from '../../types';
import { formatDuration } from '../../lib/timer';
import { USER_TIMES_ICONAME } from '../../constants';

export class TrackingItem extends TreeItem {
    constructor(
        public trackingItem: Tracking,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        const title = `${trackingItem.user.username} (${formatDuration(trackingItem.time)})`;
        super(title, collapsibleState);
        this.id = `${trackingItem.time}`;
        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', 'resources', 'official_icons', 'dark', USER_TIMES_ICONAME),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'official_icons', 'white', USER_TIMES_ICONAME)
        };
    }
    contextValue = 'trackingItem';
}