import * as vscode from 'vscode';
import { ApiWrapper } from '../lib/apiWrapper';
import { TrackingItem } from './timesItem/trackingItem';
import { IntervalItem } from './timesItem/intervalItem';
import { Interval, Tracking } from '../types';
import { unixtimeToString } from '../lib/timer';

const collapsedConst = vscode.TreeItemCollapsibleState.Collapsed;
const noCollapsedConst = vscode.TreeItemCollapsibleState.None;

export class TimesListProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    taskId?: string;
    apiwrapper: ApiWrapper;

    constructor(apiWrapper: ApiWrapper, taskId?: string) {
        if (taskId) {
            this.taskId = taskId;
        }
        this.apiwrapper = apiWrapper;
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: vscode.TreeItem): Promise<(vscode.TreeItem)[]> {
        let resolve: Array<vscode.TreeItem> = [];
        console.log("getChildren", this.taskId);
        if (!this.taskId) {
            return Promise.resolve(resolve);
        }

        if (element === undefined) {
            const trackedTime = await this.apiwrapper.getTrackedTime(this.taskId);
            if (trackedTime.length > 0) {
                resolve = Object.values(trackedTime).map((tracking: Tracking) => {
                    return new TrackingItem(tracking, collapsedConst);
                });
            }
        }

        if (element instanceof TrackingItem) {
            console.log('element', element);
            resolve = Object.values(element.trackingItem.intervals).map((interval: Interval) => {
                return new IntervalItem(
                    interval,
                    unixtimeToString(parseFloat(interval.start)),
                    unixtimeToString(parseFloat(interval.end)),
                    noCollapsedConst
                );
            });
        }

        return Promise.resolve(resolve);
    }
}