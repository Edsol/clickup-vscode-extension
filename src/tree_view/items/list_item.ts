import path = require('path');
import { TreeItem, TreeItemCollapsibleState, window } from 'vscode';

export class ListItem extends TreeItem {
    constructor(
        public id: string,
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        console.log('__dirname', __dirname);

        this.iconPath = {
            light: path.join(__dirname, '..', '..', '..', '..', 'resources', 'listItem', 'document.png'),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'listItem', 'document_white.png')
        };
    }
    contextValue = 'ListItem';
}