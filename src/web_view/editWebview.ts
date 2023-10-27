import * as vscode from 'vscode';
import * as path from 'path';
import { WebviewHelper } from './webviewHelper';
import { Task } from '../types';
import { ApiWrapper } from '../lib/apiWrapper';
import * as constant from '../constants';
import { TaskListProvider } from '../tree_view/taskListProvider';

export class EditWebview {
	context: vscode.ExtensionContext;
	wrapper: ApiWrapper;
	panel: vscode.WebviewPanel;
	webviewhelper: any;
	htmlFile: string;

	dependecies: any;
	statuses: any;
	members: any;
	tags: any;
	priorities: any;

	constructor(context: vscode.ExtensionContext, task: Task, wrapper: ApiWrapper, provider: TaskListProvider) {
		this.context = context;
		this.wrapper = wrapper;
		this.htmlFile = path.join(context.extensionPath, 'resources', 'web_view', 'edit', 'index.html');

		var promises = [
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

		this.dependecies = {
			bootstrapSrc: path.join(context.extensionPath, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css'),
			vueSrc: path.join(context.extensionPath, 'node_modules', 'vue', 'dist', 'vue.global.prod.js'),
			tagifySrc: path.join(context.extensionPath, 'node_modules', '@yaireo', 'tagify', 'dist', 'tagify.min.js'),
			tagifyCssSrc: path.join(context.extensionPath, 'node_modules', '@yaireo', 'tagify', 'dist', 'tagify.css'),
			vueApp: path.join(context.extensionPath, 'resources', 'web_view', 'edit', 'script.js'),
		};

		this.panel = vscode.window.createWebviewPanel(
			'editTask',
			task.name,
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [
					vscode.Uri.file(path.join(context.extensionPath, 'resources', 'web_view')),
					vscode.Uri.file(path.join(context.extensionPath, 'node_modules'))
				]
			}
		);

		Promise.all(promises).then((values) => {
			[this.members, this.statuses, this.tags, this.priorities] = values;

			this.webviewhelper = new WebviewHelper(context, this.panel, this.htmlFile);
			this.webviewhelper.getPanel(this.dependecies)
				.then(async (panel: any) => {
					this.panel = panel as vscode.WebviewPanel;
					this.panel.webview.postMessage({
						command: 'init',
						data: {
							task: task,
							members: WebviewHelper.filterMembers(this.members),
							statuses: WebviewHelper.filterStatuses(this.statuses),
							tags: WebviewHelper.filterTags(this.tags),
							priorities: WebviewHelper.filterPriorities(this.priorities)
						}
					});

					this.panel.webview.onDidReceiveMessage(
						async message => {
							switch (message.command) {
								case 'getMembers':
									this.panel.webview.postMessage({
										command: message.command,
										data: this.members
									});
									return;
								case "error":
									vscode.window.showErrorMessage(message.args);
									break;
								case "updateTask":
									this.updateTask(task, message.args);
									provider.refresh();
									break;
							}
						},
						undefined,
						context.subscriptions
					);
				});
		});
	}

	private async updateTask(task: Task, data: any) {
		var taskData = WebviewHelper.normalize(data, constant.DEFAULT_TASK_DETAILS);
		var response = await this.wrapper.updateTask(task.id, taskData);
		if (response) {
			await this.wrapper.updateTaskTags(task.id, task.tags, taskData.tags);
			vscode.window.showInformationMessage(constant.TASK_UPDATE_MESSAGE);
		} else {
			vscode.window.showErrorMessage(constant.TASK_UPDATE_ERROR_MESSAGE);
		}
	}
}