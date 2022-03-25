import { TreeItem, TreeItemCollapsibleState } from 'vscode';

export class TaskItem extends TreeItem {
    constructor(
        public readonly label: string,
        private name: string,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}-${this.name}`;
        this.description = this.name;
    }
}