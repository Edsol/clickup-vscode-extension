
import path = require('path');
import { TreeItem, TreeItemCollapsibleState, ThemeIcon } from 'vscode';
import { Interval } from '../../types';
import { unixtimeToString } from '../../lib/timer';

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
        this.iconPath = ThemeIcon.File;
    }
    contextValue = 'trackingItem';
}