import path = require('path');
import { TreeItem, TreeItemCollapsibleState, Command } from 'vscode';

export class TaskItem extends TreeItem {
    constructor(
        public id: string,
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
        public readonly command?: Command
    ) {
        super(label, collapsibleState);
        // this.tooltip = `${this.label}-${this.name}`;
        // this.description = this.name;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', '..', '..', 'resources', 'taskItem', 'light', 'icon.svg'),
        dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'taskItem', 'dark', 'icon.svg')
    };

    contextValue = 'taskItem';
}