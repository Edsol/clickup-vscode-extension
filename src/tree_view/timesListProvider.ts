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

    getTreeItem(element: any): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: any): Promise<(vscode.TreeItem)[]> {
        var resolve: any = [];

        if (!this.taskId) {
            return Promise.resolve(resolve);
        }

        if (element === undefined) {
            var trackedTime = await this.apiwrapper.getTrackedTime(this.taskId);
            if (trackedTime) {
                resolve = Object.values(trackedTime).map((tracking: any) => {
                    return new TrackingItem(tracking, collapsedConst);
                });
            }
        }

        if (element instanceof TrackingItem) {
            resolve = Object.values(element.trackingItem.intervals).map((interval: any) => {
                return new IntervalItem(interval, this.unixtimeToString(<number>interval.start), this.unixtimeToString(<number>interval.end), noCollapsedConst);
            });
        }

        return Promise.resolve(resolve);
    }
    /**
     *
     *
     * @private
     * @param {number} unixtime
     * @return {*} 
     * @memberof TimesListProvider
     */
    private unixtimeToString(unixtime: number) {
        var date = new Date(unixtime * 1);
        return date.toLocaleString(vscode.env.language);
    }
}