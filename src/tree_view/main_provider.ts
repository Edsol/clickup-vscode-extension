import * as vscode from 'vscode';
import * as types from '../types';
import { TaskItem } from './items/task_item';
import { ListItem } from './items/list_item';
import { SpaceItem } from './items/space_item';
import { TeamItem } from './items/team_item';

export class MainProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    teams: Array<any>;
    apiwrapper: any;

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
                return new SpaceItem(space.id, space.name, this.collapsedConst);
            });
        }

        if (element instanceof SpaceItem) {
            var lists: Array<types.List> = await this.apiwrapper.getFolderLists(element.id);
            resolve = Object.values(lists).map((list: types.List) => {
                return new ListItem(list, this.collapsedConst);
            });
        }

        if (element instanceof ListItem) {
            var tasks: Array<types.Task> = await this.apiwrapper.getTasks(element.list.id);
            resolve = Object.values(tasks).map((task: types.Task) => {
                return new TaskItem(task, this.noCollapsedConst);
            });
        }

        return Promise.resolve(resolve);
    }

}