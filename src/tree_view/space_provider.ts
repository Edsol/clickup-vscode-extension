import * as vscode from 'vscode';
import * as types from '../types';
import { TaskItem } from './items/task_item';
import { ListItem } from './list_item';
import { SpaceItem } from './space_item';

export class SpaceProviderProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    spaces: Array<types.Space>;
    apiwrapper: any;

    constructor(spaces: Array<types.Space>, propertyToShow: Array<string>, apiWrapper: any) {
        this.spaces = spaces;
        this.apiwrapper = apiWrapper;
    }

    getTreeItem(element: any): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: (types.Space)): Promise<(vscode.TreeItem)[]> {
        console.log('getChildren', element);
        var resolve: any = [];
        if (element === undefined) {
            resolve = Object.values(this.spaces).map((space: types.Space) => {
                return new SpaceItem(
                    space.id,
                    space.name,
                    vscode.TreeItemCollapsibleState.Collapsed,
                );
            });
        }

        if (element instanceof SpaceItem) {
            var lists: Array<types.List> = await this.apiwrapper.getFolderLists(element.id);
            resolve = Object.values(lists).map((list: types.List) => {
                return new ListItem(list.id, list.name, vscode.TreeItemCollapsibleState.Collapsed);
            });
        }

        if (element instanceof ListItem) {
            console.log('listItem', element);
            var tasks: Array<types.Task> = await this.apiwrapper.getTasks(element.id);
            resolve = Object.values(tasks).map((task: types.Task) => {
                return new TaskItem(task, vscode.TreeItemCollapsibleState.None);
            });
        }
        return Promise.resolve(resolve);
    }

}