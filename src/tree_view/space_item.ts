import path = require('path');
import { TreeItem, TreeItemCollapsibleState } from 'vscode';

export class SpaceItem extends TreeItem {
    constructor(
        public id: string,
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', 'resources', 'spaceItem', 'layers.png'),
            dark: path.join(__filename, '..', '..', '..', 'resources', 'spaceItem', 'layers_white.png')
        };
    }
    contextValue = 'spaceItem';
}