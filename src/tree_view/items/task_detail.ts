import { TreeItem, TreeItemCollapsibleState } from 'vscode';
export class TaskDetail extends TreeItem {
    constructor(
        public label: string,
        public readonly description: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
        this.description = description;
    }

    contextValue = 'TaskDetail';
}