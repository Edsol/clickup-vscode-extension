
import path = require('path');
import { TreeItem, TreeItemCollapsibleState, ThemeIcon } from 'vscode';
import { Interval } from '../../types';
import { unixtimeToString } from '../../lib/timer';
import { TIME_TIMES_ICONAME } from '../../constants';

export class IntervalItem extends TreeItem {
    constructor(
        public intervalItem: Interval,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        const start = unixtimeToString(Number.parseInt(intervalItem.start));
        const end = unixtimeToString(Number.parseInt(intervalItem.end));
        const title = `${start} - ${end}`;

        super(title, collapsibleState);
        this.id = `${intervalItem.id}`;
        this.iconPath = {
            light: path.join(__filename, '..', '..', '..', '..', 'resources', 'official_icons', 'dark', TIME_TIMES_ICONAME),
            dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'official_icons', 'white', TIME_TIMES_ICONAME)
        };
    }
    contextValue = 'trackingItem';
}