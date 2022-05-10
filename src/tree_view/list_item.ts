import * as types from '../types';
import { TreeItem, TreeItemCollapsibleState } from 'vscode';

export class ListItem extends TreeItem {
    constructor(
        public id: string,
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }
    contextValue = 'ListItem';
}