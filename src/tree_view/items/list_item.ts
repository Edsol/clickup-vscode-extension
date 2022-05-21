import path = require('path');
import { TreeItem, TreeItemCollapsibleState, window } from 'vscode';
import { List } from '../../types';

export class ListItem extends TreeItem {
    constructor(
        public list: List,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(list.name, collapsibleState);
        this.id = list.id;
        this.iconPath = {
            light: path.join(__dirname, '..', '..', '..', '..', 'resources', 'listItem', 'document.png'),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'listItem', 'document_white.png')
        };
    }
    contextValue = 'listItem';
}