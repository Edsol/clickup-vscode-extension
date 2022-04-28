import * as vscode from 'vscode';
import * as path from 'path';
import { WebviewHelper } from './webviewHelper';
import { Task } from '../types';

export class EditWebview {
    context: vscode.ExtensionContext;
    panel: vscode.WebviewPanel;
    webviewhelper: WebviewHelper;
    htmlFile: string;

    dependecies: any;

    constructor(context: vscode.ExtensionContext, task: Task, args: any) {
        this.context = context;
        this.htmlFile = path.join(context.extensionPath, 'src', 'web_view', 'edit', 'edit.html');

        this.dependecies = {
            bootstrapSrc: path.join(context.extensionPath, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css'),
            vueSrc: path.join(context.extensionPath, 'node_modules', 'vue', 'dist', 'vue.global.js'),
            tagifySrc: path.join(context.extensionPath, 'node_modules', '@yaireo', 'tagify', 'dist', 'tagify.vue'),
            tagifyCssSrc: path.join(context.extensionPath, 'node_modules', '@yaireo', 'tagify', 'dist', 'tagify.css'),
            vueApp: path.join(context.extensionPath, 'src', 'web_view', 'edit', 'main.js'),
        };

        this.panel = vscode.window.createWebviewPanel(
            'editTask',
            task.name,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath, 'src', 'web_view')),
                    vscode.Uri.file(path.join(context.extensionPath, 'node_modules'))
                ]
            }
        );

        this.webviewhelper = new WebviewHelper(context, this.panel, this.htmlFile);
        this.webviewhelper.getPanel(this.dependecies, true)
            .then((panel) => {
                this.panel = panel as vscode.WebviewPanel;

                this.panel.webview.postMessage({
                    command: 'loadMembers',
                    data: args.members
                });

                this.panel.webview.postMessage({
                    command: 'taskData',
                    data: task
                });

                this.panel.webview.onDidReceiveMessage(
                    async message => {
                        switch (message.command) {
                            case 'getMembers':
                                this.panel.webview.postMessage({
                                    command: message.command,
                                    data: args.members
                                });
                                return;
                            case "error":
                                vscode.window.showErrorMessage(message.args);
                                break;
                            case "updateTask":
                                //TODO: update only edited fields
                                var response = await args.wrapper.updateTask(message.args.id, {
                                    name: message.args.name,
                                    description: message.args.description
                                });

                                if (response) {
                                    vscode.window.showInformationMessage('Task updated');
                                }
                                break;
                        }
                    },
                    undefined,
                    context.subscriptions
                );
            });
    }

}