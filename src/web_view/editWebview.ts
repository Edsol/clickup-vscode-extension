import * as vscode from 'vscode';
import { Task } from '../types';
import { ApiWrapper } from '../lib/apiWrapper';
import { TaskListProvider } from '../tree_view/taskListProvider';
import { isDark } from '../utils';
import * as constant from '../constants';

export class EditWebview {
	context: vscode.ExtensionContext;
	wrapper: ApiWrapper;
	listProvider: TaskListProvider;
	panel: vscode.WebviewPanel;
	task: Task;
	webviewhelper: any;
	htmlFile: string;
	promises: any;

	dependecies: any;
	statuses: any;
	members: any;
	tags: any;
	priorities: any;

	constructor(context: vscode.ExtensionContext, task: Task, wrapper: ApiWrapper, provider: TaskListProvider) {
		this.context = context;
		this.wrapper = wrapper;
		this.listProvider = provider;
		this.task = task;

		this.promises = [
			new Promise(async (resolve) => {
				resolve(await wrapper.getMembers(task.list.id));
			}),
			new Promise(async (resolve) => {
				resolve(await wrapper.getStatus(task.list.id));
			}),
			new Promise(async (resolve) => {
				resolve(await wrapper.getTags(task.space.id));
			}),
			new Promise(async (resolve) => {
				resolve(await wrapper.getPriorities(task.space.id));
			}),
		];

		Promise.all(this.promises).then((values) => {
			[this.members, this.statuses, this.tags, this.priorities] = values;
		});

		this.panel = vscode.window.createWebviewPanel(
			'editTask',
			task.name,
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
					this.updateTask(this.task, message.data.task);
					break;
			}
		});
	}

	private pushToWebview() {
		this.sendMessage('task', {
			task: this.task,
			statuses: this.statuses,
			tags: this.tags,
			priorities: this.priorities,
			members: this.members
		});
	}

	private async updateTask(task: Task, data: any) {
		const response = await this.wrapper.updateTask(task, data);
		if (response) {
			vscode.window.showInformationMessage(constant.TASK_UPDATE_MESSAGE);
			this.task = response;
			this.pushToWebview(); // update data in webview
			this.listProvider.refresh();
		} else {
			vscode.window.showErrorMessage(constant.TASK_UPDATE_ERROR_MESSAGE);
		}
	}
}