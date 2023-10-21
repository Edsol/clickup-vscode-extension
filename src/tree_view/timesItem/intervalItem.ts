
import path = require('path');
import { TreeItem, TreeItemCollapsibleState, ThemeIcon } from 'vscode';
import { Interval } from '../../types';

export class IntervalItem extends TreeItem {
    constructor(
        public intervalItem: Interval,
        public start: any,
        public end: any,
        public readonly collapsibleState: TreeItemCollapsibleState
    ) {
        super(start + " - " + end, collapsibleState);
        this.id = "" + intervalItem.id;
        this.iconPath = ThemeIcon.File;
    }
    contextValue = 'trackingItem';
}