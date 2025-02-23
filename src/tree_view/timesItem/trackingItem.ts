
import path = require('path');
import { TreeItem, TreeItemCollapsibleState, Uri } from 'vscode';
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
            light: Uri.file(path.join(__filename, '..', '..', '..', '..', 'resources', 'official_icons', 'dark', USER_TIMES_ICONAME)),
            dark: Uri.file(path.join(__filename, '..', '..', '..', '..', 'resources', 'official_icons', 'white', USER_TIMES_ICONAME))
        };
    }
    contextValue = 'trackingItem';
}