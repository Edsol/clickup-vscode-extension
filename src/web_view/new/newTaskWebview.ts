import * as vscode from 'vscode';
import * as path from 'path';
import { WebviewHelper } from '../webviewHelper';
import { Member, Statuses, Task, Tag, Priority, Status, List } from '../../types';
import { ApiWrapper } from '../../api_wrapper';
import { ListItem } from '../../tree_view/items/list_item';
import * as constants from './../../constants';

export class NewTaskWebview {
    context: vscode.ExtensionContext;
    wrapper: ApiWrapper;
    panel: vscode.WebviewPanel;
    htmlFile: string;

    dependecies: any;
    statuses: any;
    members: any;
    tags: any;
    priorities: any;

    constructor(context: vscode.ExtensionContext, listItem: ListItem, wrapper: ApiWrapper) {
        this.context = context;
        this.wrapper = wrapper;

        this.htmlFile = path.join(context.extensionPath, 'src', 'web_view', 'new', 'index.html');
        var listId = listItem.list.id;
        var spaceId = listItem.list.space.id;

        var promises = [
            new Promise(async (resolve) => {
                resolve(await wrapper.getMembers(listId));
            }),
            new Promise(async (resolve) => {
                resolve(await wrapper.getStatus(listId));
            }),
            new Promise(async (resolve) => {
                resolve(await wrapper.getTags(spaceId));
            }),
            new Promise(async (resolve) => {
                resolve(await wrapper.getPriorities(spaceId));
            }),
        ];

        this.dependecies = {
            bootstrapSrc: path.join(context.extensionPath, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css'),
            vueSrc: path.join(context.extensionPath, 'node_modules', 'vue', 'dist', 'vue.global.js'),
            tagifySrc: path.join(context.extensionPath, 'node_modules', '@yaireo', 'tagify', 'dist', 'tagify.min.js'),
            tagifyCssSrc: path.join(context.extensionPath, 'node_modules', '@yaireo', 'tagify', 'dist', 'tagify.css'),
            vueApp: path.join(context.extensionPath, 'src', 'web_view', 'new', 'script.js'),
        };

        this.panel = vscode.window.createWebviewPanel(
            'newTask',
            'new Clickup task',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath, 'src', 'web_view')),
                    vscode.Uri.file(path.join(context.extensionPath, 'node_modules'))
                ]
            }
        );

        Promise.all(promises).then((values) => {
            [this.members, this.statuses, this.tags, this.priorities] = values;

            console.log('members', this.members);

            var webviewhelper = new WebviewHelper(context, this.panel, this.htmlFile);
            webviewhelper.getPanel(this.dependecies)
                .then(async (panel) => {
                    this.panel = panel as vscode.WebviewPanel;

                    this.panel.webview.postMessage({
                        command: 'init',
                        data: {
                            list: listItem.list,
                            members: this.filterMembers(this.members),
                            statuses: this.filterStatuses(this.statuses),
                            tags: this.filterTags(this.tags),
                            priorities: this.filterPriorities(this.priorities)
                        }
                    });

                    this.panel.webview.onDidReceiveMessage(
                        async message => {
                            switch (message.command) {
                                case "error":
                                    vscode.window.showErrorMessage(message.args);
                                    break;
                                case "newTask":
                                    this.saveTask(listItem.list.id, message.args);
                                    break;
                            }
                        },
                        undefined,
                        context.subscriptions
                    );
                });
        });
    }

    private async saveTask(listId: string, data: any) {
        var taskData = this.normalize(data);
        var response = await this.wrapper.newTask(listId, taskData);
        if (response.id) {
            vscode.window.showInformationMessage(constants.TASK_SAVE_SUCCESS_MESSAGE);
            this.panel.dispose();
        } else {
            console.log('data', data);
            console.log('normalized data', taskData);
            vscode.window.showErrorMessage(constants.TASK_SAVE_ERROR_MESSAGE);
        }
    }

    private normalize(data: any) {
        if (data.assignees) {
            data.assignees = data.assignees.map((member: any) => {
                return member.id;
            });
        }
        if (data.status) {
            data.status = data.status.value;
        }
        if (data.priority) {
            data.priority = parseInt(data.priority.id);
        }
        if (data.tags) {
            data.tags = data.tags.map((tag: any) => {
                return tag.name;
            });
        }

        return data;
    }

    private filterMembers(members: Array<Member>) {
        var result: Array<any> = [];
        for (var member of members) {
            result.push({
                id: member.id,
                value: member.username,
                name: member.username
            });
        }

        return result;
    }

    private filterStatuses(statuses: Array<Statuses>) {
        var result: Array<any> = [];
        for (var status of statuses) {
            result.push({
                id: status.id,
                value: status.status,
                name: status.status
            });
        }

        return result;
    }

    private filterTags(tags: Array<Tag>) {
        var result: Array<any> = [];
        for (var tag of tags) {
            result.push({
                value: tag.name,
                name: tag.name
            });
        }

        return result;
    }

    private filterPriorities(priorities: Array<Priority>) {
        var result: Array<any> = [];
        for (var priority of priorities) {
            result.push({
                id: priority.id,
                value: priority.priority,
                name: priority.priority
            });
        }

        return result;
    }



}