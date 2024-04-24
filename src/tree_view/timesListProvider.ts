import * as vscode from 'vscode';
import { ApiWrapper } from '../lib/apiWrapper';
import { TrackingItem } from './timesItem/trackingItem';
import { IntervalItem } from './timesItem/intervalItem';

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
        const resolve: Array<vscode.TreeItem> = [];
        if (!this.taskId) {
            return Promise.resolve(resolve);
        }

        if (element === undefined) {
            const trackedTime = await this.apiwrapper.getTrackedTime(this.taskId);
            if (trackedTime) {
                for (const tracking of trackedTime) {
                    resolve.push(new TrackingItem(tracking, collapsedConst));
                }
            }
        }

        if (element instanceof TrackingItem) {
            for (const interval of element.trackingItem.intervals) {
                resolve.push(new IntervalItem(interval, noCollapsedConst));
            }
            return resolve;
        }

        return Promise.resolve(resolve);
    }
}