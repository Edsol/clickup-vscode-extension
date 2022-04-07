import path = require('path');
import { TreeItem, TreeItemCollapsibleState, Command } from 'vscode';
import * as types from '../../types';

export class TaskItem extends TreeItem {
    constructor(
        public id: string,
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
        public readonly priority?: types.Priority
    ) {
        super(label, collapsibleState);

        var iconName = this.getIcon(this.priority);
        this.iconPath = this.getIconPath(iconName);
    }

    contextValue = 'taskItem';

    getIconPath(iconName: string) {
        return {
            light: path.join(__filename, '..', '..', '..', '..', 'resources', 'taskItem', 'light', iconName),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'taskItem', 'dark', iconName)
        };
    }

    getIcon(priority: types.Priority | undefined) {
        if (priority === undefined || priority === null) {
            return 'priority-normal.svg';
        }

        return `priority-${priority.priority}.svg`;
    }
}