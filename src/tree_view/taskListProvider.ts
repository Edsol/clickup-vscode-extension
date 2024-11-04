import * as vscode from 'vscode';
import * as types from '../types';
import { TaskItem } from './items/task_item';
import { ListItem } from './items/list_item';
import { SpaceItem } from './items/space_item';
import { TeamItem } from './items/team_item';
import { FolderItem } from './items/folder_item';
import { ApiWrapper } from '../lib/apiWrapper';

export class TaskListProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    teams: Array<any>;
    apiwrapper: ApiWrapper;
    debugMode: boolean;

    collapsedConst = vscode.TreeItemCollapsibleState.Collapsed;
    noCollapsedConst = vscode.TreeItemCollapsibleState.None;

    constructor(teams: Array<any>, propertyToShow: Array<string>, apiWrapper: any, debugMode: boolean = false) {
        this.teams = teams;
        this.apiwrapper = apiWrapper;
        this.debugMode = debugMode;
    }

    getTreeItem(element: any): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: (types.Space)): Promise<(vscode.TreeItem)[]> {
        var resolve: any = [];

        if (element === undefined) {
            resolve = Object.values(this.teams).map((team: any) => {
                return new TeamItem(team.id, team.name, this.collapsedConst);
            });
            return Promise.resolve(resolve);
        }

        if (element instanceof TeamItem) {
            var spaces: Array<any> = await this.apiwrapper.getSpaces(element.id);

            this.log(`spaces of ${element.label}`, {
                projectId: element.id,
                result: spaces,
            });
            resolve = Object.values(spaces).map((space: any) => {
                return new SpaceItem(space, this.collapsedConst);
            });
        }

        if (element instanceof SpaceItem) {
            const folders: Array<types.Folder> = await this.apiwrapper.getFolders(element.id);
            this.log(`folders of ${element.label}`, {
                space: element.space,
                result: folders,
            });
            resolve = Object.values(folders).map((folder: types.Folder) => {
                return new FolderItem(folder, this.collapsedConst);
            });
            const folderlessList: Array<types.List> = await this.apiwrapper.getFolderlessLists(element.id);

            this.log(`folderless list of ${element.label}`, {
                space: element.space,
                result: folderlessList,
            });

            await Promise.all(
                Object.values(folderlessList).map(async (list: types.List) => {
                    var taskCount = await this.apiwrapper.countTasks(list.id);
                    resolve.push(new ListItem(list, this.collapsedConst, taskCount));
                })
            );

        }

        if (element instanceof FolderItem) {
            const lists: Array<types.List> = await this.apiwrapper.getLists(element.folder.id);
            this.log(`lists of ${element.label}`, {
                folder: element.folder,
                result: lists,
            });
            await Promise.all(
                Object.values(lists).map(async (list: types.List) => {
                    //* Fetches the task count for the list
                    var taskCount = await this.apiwrapper.countTasks(list.id);
                    resolve.push(new ListItem(list, this.collapsedConst, taskCount));
                })
            );
        }

        if (element instanceof ListItem) {
            const tasks: Array<types.Task> = await this.apiwrapper.getTasks(element.list.id);
            this.log(`tasks of ${element.label}`, {
                folder: element.list,
                result: tasks,
            });
            for (const task of tasks) {
                resolve.push(new TaskItem(task, this.noCollapsedConst));
            }
        }

        return Promise.resolve(resolve);
    }

    private _onDidChangeTreeData: vscode.EventEmitter<undefined | null | void> = new vscode.EventEmitter<undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    log(text: string, datas: any): void {
        if (this.debugMode === false) {
            return;
        }

        console.log(text, datas);
    }

}