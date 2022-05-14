import * as vscode from 'vscode';
import * as path from 'path';
import { WebviewHelper } from '../webviewHelper';
import { Member, Statuses, Task, Tag, Priority, Status, List } from '../../types';
import { ApiWrapper } from '../../api_wrapper';

export class NewTaskWebview {
    context: vscode.ExtensionContext;
    panel: vscode.WebviewPanel;
    htmlFile: string;

    dependecies: any;
    statuses: any;
    members: any;
    tags: any;
    priorities: any;

    constructor(context: vscode.ExtensionContext, list: List, wrapper: ApiWrapper) {
        this.context = context;
        this.htmlFile = path.join(context.extensionPath, 'src', 'web_view', 'new', 'index.html');

        console.log(list);

        var promises = [
            new Promise(async (resolve) => {
                resolve(await wrapper.getMembers(list.id));
            }),
            new Promise(async (resolve) => {
                resolve(await wrapper.getStatus(list.id));
            }),
            // new Promise(async (resolve) => {
            //     resolve(await wrapper.getTags(space.id));
            // }),
            // new Promise(async (resolve) => {
            //     resolve(await wrapper.getPriorities(space.id));
            // }),
        ];

        this.dependecies = {
            bootstrapSrc: path.join(context.extensionPath, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css'),
            vueSrc: path.join(context.extensionPath, 'node_modules', 'vue', 'dist', 'vue.global.js'),
            tagifySrc: path.join(context.extensionPath, 'node_modules', '@yaireo', 'tagify', 'dist', 'tagify.min.js'),
            tagifyCssSrc: path.join(context.extensionPath, 'node_modules', '@yaireo', 'tagify', 'dist', 'tagify.css'),
            vueApp: path.join(context.extensionPath, 'src', 'web_view', 'edit', 'script.js'),
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


            var webviewhelper = new WebviewHelper(context, this.panel, this.htmlFile);
            webviewhelper.getPanel(this.dependecies)
                .then(async (panel) => {
                    this.panel = panel as vscode.WebviewPanel;


                    this.panel.webview.postMessage({
                        command: 'init',
                        data: {
                            list: list,
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
                                    var response = await wrapper.newTask(message.args);
                                    vscode.window.showInformationMessage('newTask:' + response.id);
                                    this.panel.dispose();
                                    break;
                            }
                        },
                        undefined,
                        context.subscriptions
                    );
                });
        });
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

    // private findStatuses(id: String) {
    // 	return Object(this.statuses).find((status: any) => status.id === id);
    // }

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