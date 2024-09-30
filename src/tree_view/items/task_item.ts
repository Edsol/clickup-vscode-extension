import path = require('path');
import { TreeItem, TreeItemCollapsibleState, ThemeIcon } from 'vscode';
import * as types from '../../types';
import { TASK_ICONAME } from '../../constants';
import { getColoredIconPath, Utils } from '../../utils';

export class TaskItem extends TreeItem {
    constructor(
        public task: types.Task,
        public readonly collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.None,
    ) {
        super(task.name, collapsibleState);

        var priorityName = 'none';
        if (task.priority !== null) {
            priorityName = task.priority.priority;
        }
        this.tooltip = `status: ${task.status.status}\npriority: ${priorityName}`;
        this.iconPath = getColoredIconPath(path.join(__filename, '..', '..', '..', '..', 'resources', 'official_icons', 'white', TASK_ICONAME), task.status.color);
    }

    contextValue = 'taskItem';
}