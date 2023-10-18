import * as vscode from 'vscode';
import { ApiWrapper } from '../api_wrapper';
import { TrackingItem } from './timesItem/trackingItem';
import { IntervalItem } from './timesItem/intervalItem';

const collapsedConst = vscode.TreeItemCollapsibleState.Collapsed;
const noCollapsedConst = vscode.TreeItemCollapsibleState.None;

export class TimesListProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    taskId: string;
    apiwrapper: ApiWrapper;

    constructor(taskId: string, apiWrapper: any) {
        this.taskId = taskId;
        this.apiwrapper = apiWrapper;
    }

    getTreeItem(element: any): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: any): Promise<(vscode.TreeItem)[]> {
        var resolve: any = [];

        if (element === undefined) {
            var trackedTime = await this.apiwrapper.getTrackedTime(this.taskId);
            resolve = Object.values(trackedTime).map((tracking: any) => {
                return new TrackingItem(tracking, collapsedConst);
            });
        }

        if (element instanceof TrackingItem) {
            resolve = Object.values(element.trackingItem.intervals).map((interval: any) => {
                console.log(interval);
                return new IntervalItem(interval, noCollapsedConst);
            });
        }

        return Promise.resolve(resolve);
    }
}