import * as vscode from 'vscode';
import * as path from 'path';
import { WebviewHelper } from '../web_view/webviewHelper';
import { ApiWrapper } from '../lib/apiWrapper';
import { ListItem } from '../tree_view/items/list_item';
import * as constants from './../constants';
import { TaskListProvider } from '../tree_view/taskListProvider';

export class NewTaskWebview {
    context: vscode.ExtensionContext;
    wrapper: ApiWrapper;
    panel: vscode.WebviewPanel;
    htmlFile: string;
    promises: any;
    listId: string;
    spaceId: string;

    dependecies: any;
    statuses: any;
    members: any;
    tags: any;
    priorities: any;

    constructor(context: vscode.ExtensionContext, listItem: ListItem, wrapper: ApiWrapper, provider: TaskListProvider) {
        this.context = context;
        this.wrapper = wrapper;
        this.listId = listItem.list.id;
        this.spaceId = listItem.list.space.id;

        this.promises = [
            new Promise(async (resolve) => {
                resolve(await wrapper.getMembers(this.listId));
            }),
            new Promise(async (resolve) => {
                resolve(await wrapper.getStatus(this.listId));
            }),
            new Promise(async (resolve) => {
                resolve(await wrapper.getTags(this.spaceId));
            }),
            new Promise(async (resolve) => {
                resolve(await wrapper.getPriorities(this.spaceId));
            }),
        ];

        Promise.all(this.promises).then((values) => {
            [this.members, this.statuses, this.tags, this.priorities] = values;
        });


        this.panel = vscode.window.createWebviewPanel(
            'newTask',
            'new task',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        this.initPanel();
        this.messageHandler();
    }

    private initPanel() {
        const updateWebview = () => {
            this.panel!.webview.html = this.getWebviewContent();
        };

        updateWebview();

        // Crea un watcher per ricaricare la WebView quando il file cambia
        const watcher = vscode.workspace.createFileSystemWatcher(
            new vscode.RelativePattern(this.context.extensionPath, '**/*.{ts,js,tsx}')
        );

        watcher.onDidChange(() => {
            updateWebview();  // Ricarica la WebView
        });

        this.context.subscriptions.push(watcher);
    }

    private getWebviewContent(scriptUri?: vscode.Uri) {
        const devServerUri = `http://localhost:3000/webview.js?v=${new Date().getTime()}`;

        return `<!DOCTYPE html>
		<html lang="en">
		<head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>React Webview</title>
		</head>
		<body>
		  <div id="app"></div>
		  <script src="${devServerUri}"></script>
		</body>
		</html>`;
    }

    private async sendMessage(type: string, data: Object) {
        return await this.panel.webview.postMessage({
            type: type,
            data: data
        });
    }

    private messageHandler() {
        this.panel.webview.onDidReceiveMessage(message => {
            switch (message.type) {
                case 'init':
                    this.sendMessage('theme', {
                        isDark: false
                    });
                    break;
                case 'ready':
                    this.pushToWebview();

                    break;
                case 'save':
                    this.saveTask(message.data.task);
                    break;
            }
        });
    }

    private pushToWebview() {
        this.sendMessage('task', {
            task: {},
            statuses: this.statuses,
            tags: this.tags,
            priorities: this.priorities,
            members: this.members
        });
    }

    private async saveTask(data: any) {
        var response = await this.wrapper.newTask(this.listId, data);
        if (response.id) {
            vscode.window.showInformationMessage(constants.TASK_SAVE_SUCCESS_MESSAGE);
            this.panel.dispose();
        } else {
            vscode.window.showErrorMessage(constants.TASK_SAVE_ERROR_MESSAGE);
        }
    }
}