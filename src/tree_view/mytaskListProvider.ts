import * as vscode from 'vscode';
import * as types from '../types';
import { TaskItem } from './items/task_item';
import { ApiWrapper } from '../lib/apiWrapper';

export class MyTaskListProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    apiwrapper: ApiWrapper;
    teams: types.Team[];
    userId: string;

    constructor(apiWrapper: any, teams: Array<types.Team>, userId: string) {
        this.apiwrapper = apiWrapper;
        this.userId = userId;
        this.teams = teams;
    }

    getTreeItem(element: any): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: (types.Space)): Promise<(vscode.TreeItem)[]> {
        let resolve: any = undefined;

        for (const team of this.teams) {
            var tasks = await this.apiwrapper.getMyTask(team.id, this.userId);
            resolve = Object.values(tasks)
                .map((task: any) => {
                    return new TaskItem(task);
                });

        }
        return Promise.resolve(resolve);
    }
}