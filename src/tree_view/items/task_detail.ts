import path = require('path');
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
export class TaskDetail extends TreeItem {
    constructor(
        public label: string,
        public readonly description: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
        public details?: any
    ) {
        super(label, collapsibleState);
        this.description = description;
        this.details = details;
    }

    contextValue = 'TaskDetail';

    iconPath = {
        light: path.join(__filename, '..', '..', '..', '..', 'resources', 'detail_blank.svg'),
        dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'detail_white.svg')
    };
}