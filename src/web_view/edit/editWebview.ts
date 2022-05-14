import * as vscode from 'vscode';
import * as path from 'path';
import { WebviewHelper } from '../webviewHelper';
import { Member, Statuses, Task, Tag, Priority, Status } from '../../types';
import { ApiWrapper } from '../../api_wrapper';

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

	constructor(context: vscode.ExtensionContext, task: Task, wrapper: ApiWrapper) {
		this.context = context;
		this.wrapper = wrapper;
		this.htmlFile = path.join(context.extensionPath, 'src', 'web_view', 'edit', 'index.html');

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
			vueSrc: path.join(context.extensionPath, 'node_modules', 'vue', 'dist', 'vue.global.js'),
			tagifySrc: path.join(context.extensionPath, 'node_modules', '@yaireo', 'tagify', 'dist', 'tagify.min.js'),
			tagifyCssSrc: path.join(context.extensionPath, 'node_modules', '@yaireo', 'tagify', 'dist', 'tagify.css'),
			vueApp: path.join(context.extensionPath, 'src', 'web_view', 'edit', 'script.js'),
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
									//TODO: update only edited fields
									this.updateTask(message.args.id, message.args);
									break;
							}
						},
						undefined,
						context.subscriptions
					);
				});
		});
	}

	private async updateTask(taskId: string, data: any) {
		var taskData = WebviewHelper.normalize(data);
		var response = await this.wrapper.updateTask(taskId, taskData);

		if (response) {
			vscode.window.showInformationMessage('Task updated');
		}
	}
}