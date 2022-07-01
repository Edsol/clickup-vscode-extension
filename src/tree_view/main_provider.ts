import * as vscode from 'vscode';
import * as types from '../types';
import { TaskItem } from './items/task_item';
import { ListItem } from './items/list_item';
import { SpaceItem } from './items/space_item';
import { TeamItem } from './items/team_item';
import { FolderItem } from './items/folder_item';
import { ApiWrapper } from '../api_wrapper';

export class MainProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    teams: Array<any>;
    apiwrapper: ApiWrapper;

    collapsedConst = vscode.TreeItemCollapsibleState.Collapsed;
    noCollapsedConst = vscode.TreeItemCollapsibleState.None;

    constructor(teams: Array<any>, propertyToShow: Array<string>, apiWrapper: any) {
        this.teams = teams;
        this.apiwrapper = apiWrapper;
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
            resolve = Object.values(spaces).map((space: any) => {
                return new SpaceItem(space, this.collapsedConst);
            });
        }

        if (element instanceof SpaceItem) {
            var folders: Array<types.Folder> = await this.apiwrapper.getFolders(element.id);
            resolve = Object.values(folders).map((folder: types.Folder) => {
                return new FolderItem(folder, this.collapsedConst);
            });
            var lists: Array<types.List> = await this.apiwrapper.getFolderLists(element.id);
            await Promise.all(
                Object.values(lists).map(async (list: types.List) => {
                    var taskCount = await this.apiwrapper.countTasks(list.id);
                    resolve.push(new ListItem(list, this.collapsedConst, taskCount));
                })
            );

        }

        if (element instanceof FolderItem) {
            var lists: Array<types.List> = await this.apiwrapper.getLists(element.folder.id);
            await Promise.all(
                Object.values(lists).map(async (list: types.List) => {
                    //* Fetches the task count for the list
                    var taskCount = await this.apiwrapper.countTasks(list.id);
                    resolve.push(new ListItem(list, this.collapsedConst, taskCount));
                })
            );
        }

        if (element instanceof ListItem) {
            var tasks: Array<types.Task> = await this.apiwrapper.getTasks(element.list.id);
            resolve = Object.values(tasks).map((task: types.Task) => {
                return new TaskItem(task, this.noCollapsedConst);
            });
        }

        return Promise.resolve(resolve);
    }

    private _onDidChangeTreeData: vscode.EventEmitter<undefined | null | void> = new vscode.EventEmitter<undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<undefined | null | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

}