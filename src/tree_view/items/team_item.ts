import path = require('path');
import { TreeItem, TreeItemCollapsibleState, Uri } from 'vscode';
import { PROJECT_ICONAME } from '../../constants';

export class TeamItem extends TreeItem {
    constructor(
        public id: string,
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.iconPath = {
            light: Uri.file(path.join(__filename, '..', '..', '..', '..', 'resources', 'official_icons', 'dark', PROJECT_ICONAME)),
            dark: Uri.file(path.join(__filename, '..', '..', '..', '..', 'resources', 'official_icons', 'white', PROJECT_ICONAME))
        };
    }
    contextValue = 'teamItem';
}