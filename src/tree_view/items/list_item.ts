import path = require('path');
import { TreeItem, TreeItemCollapsibleState, Uri } from 'vscode';
import { List } from '../../types';
import { LIST_ICONAME } from '../../constants';

export class ListItem extends TreeItem {
    constructor(
        public list: List,
        public readonly collapsibleState: TreeItemCollapsibleState,
        public taskCounter?: number,
    ) {
        if (taskCounter === undefined) {
            taskCounter = 0;
        }
        super(list.name + ` (${taskCounter})`, collapsibleState);
        this.id = list.id;
        this.iconPath = {
            light: Uri.file(path.join(__dirname, '..', '..', '..', '..', 'resources', 'official_icons', 'dark', LIST_ICONAME)),
            dark: Uri.file(path.join(__filename, '..', '..', '..', '..', 'resources', 'official_icons', 'white', LIST_ICONAME))
        };
    }
    contextValue = 'listItem';
}