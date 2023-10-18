
import path = require('path');
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { Interval } from '../../types';

export class IntervalItem extends TreeItem {
    constructor(
        public intervalItem: Interval,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(intervalItem.start + " - " + intervalItem.end, collapsibleState);
        this.id = "" + intervalItem.id;
        this.iconPath = {
            light: path.join(__dirname, '..', '..', '..', '..', 'resources', 'folderItem', 'documents.png'),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'folderItem', 'documents_white.png')
        };
    }
    contextValue = 'trackingItem';
}