import path = require('path');
import { TreeItem, TreeItemCollapsibleState } from 'vscode';

export class TeamItem extends TreeItem {
    constructor(
        public id: string,
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', 'resources', 'teamItem', 'documents.png'),
            dark: path.join(__filename, '..', '..', '..', 'resources', 'teamItem', 'documents_white.png')
        };
    }
    contextValue = 'TeamItem';
}