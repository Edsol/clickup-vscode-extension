import * as types from '../../types';
import { TreeItem, TreeItemCollapsibleState, Command } from 'vscode';

export class StatusItem extends TreeItem {
    constructor(
        public id: string,
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
        public tasks: types.Task
    ) {
        super(label, collapsibleState);
        this.tasksList = tasks;
    }
    tasksList: any;
    contextValue = 'statusItem';
}