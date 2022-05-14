import * as vscode from 'vscode';
import * as path from 'path';
import { WebviewHelper } from '../webviewHelper';
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

            var webviewhelper = new WebviewHelper(context, this.panel, this.htmlFile);
            webviewhelper.getPanel(this.dependecies)
                .then(async (panel) => {
                    this.panel = panel as vscode.WebviewPanel;

                    this.panel.webview.postMessage({
                        command: 'init',
                        data: {
                            list: listItem.list,
                            members: WebviewHelper.filterMembers(this.members),
                            statuses: WebviewHelper.filterStatuses(this.statuses),
                            tags: WebviewHelper.filterTags(this.tags),
                            priorities: WebviewHelper.filterPriorities(this.priorities)
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
        var taskData = WebviewHelper.normalize(data);
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
}