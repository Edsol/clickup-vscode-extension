import path = require('path');
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { Space } from '../../types';
import { TEAM_ICONAME } from '../../constants';

export class SpaceItem extends TreeItem {
    constructor(
        public space: Space,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(space.name, collapsibleState);
        this.id = space.id;
        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', 'resources', 'official_icons', 'dark', TEAM_ICONAME),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'official_icons', 'white', TEAM_ICONAME)
        };
    }
    contextValue = 'spaceItem';
}