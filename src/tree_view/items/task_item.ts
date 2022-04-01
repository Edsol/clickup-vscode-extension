import path = require('path');
import { TreeItem, TreeItemCollapsibleState } from 'vscode';

export class TaskItem extends TreeItem {
    iconPath = {
        light: path.join(__filename, '..', '..', '..', '..', 'resources', 'taskItem', 'light', 'icon.svg'),
        dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'taskItem', 'dark', 'icon.svg')
    };

    constructor(
        public id: string,
        public readonly label: string,
        // private name: string,s
        public readonly collapsibleState: TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
        // this.tooltip = `${this.label}-${this.name}`;
        // this.description = this.name;
    }
}