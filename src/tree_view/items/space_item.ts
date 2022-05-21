import path = require('path');
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { Space } from '../../types';

export class SpaceItem extends TreeItem {
    constructor(
        public space: Space,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(space.name, collapsibleState);
        this.id = space.id;
        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', 'resources', 'spaceItem', 'layers.png'),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'spaceItem', 'layers_white.png')
        };
    }
    contextValue = 'spaceItem';
}