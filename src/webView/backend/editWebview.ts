import * as vscode from 'vscode';
import { Task } from '../../types';
import { ApiWrapper } from '../../lib/apiWrapper';
import { TaskListProvider } from '../../tree_view/taskListProvider';
import { isDark } from '../../utils';
import * as constant from '../../constants';
import TaskWebview from './taskWebview';
import path from 'path';

export enum CommandList { 'init', "ready", "save", "openTask", "notification", "comment" };

export class EditWebview extends TaskWebview {
	task: Task;
	l10n: any; //TODO - fix type

	constructor(context: vscode.ExtensionContext, taskId: string, wrapper: ApiWrapper, provider: TaskListProvider, globalL10n: any) {
		super(context, wrapper, provider);
		this.l10n = globalL10n;
		// this.task = task;

		// workaround: recall getTask function to get Task with theirs subtasks
		wrapper.getTask(taskId).then((task) => {
			this.task = task;

			this.panel = vscode.window.createWebviewPanel(
				'editTask',
				task.name,
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					localResourceRoots: [
						vscode.Uri.file(path.join(context.extensionPath, 'out')),
						vscode.Uri.file(path.join(context.extensionPath, 'node_modules'))
					],
				}
			);

			this.initPanel();
			this.messageHandler();
		});

	}

	messageHandler() {
		this.panel.webview.onDidReceiveMessage(async (message) => {
			switch (message.command) {
				case 'init':
					this.sendMessage('theme', {
						isDark: isDark()
					});
					break;
				case 'ready':
					await this.pushToWebview();

					break;
				case 'save':
					await this.updateTask(this.task, message.data.task);
					break;
				case 'openTask':
					vscode.commands.executeCommand('clickup.editTask', message.data.task);
					break;
				case 'notification':
					if (message.type === 'success') {
						vscode.window.showInformationMessage(message.text);
					} else {
						vscode.window.showErrorMessage(message.text);
					}
					break;
				case "addComment":
					const response = await this.wrapper.addComment(message.data.taskId, message.data.comment);
					if (response === true) {
						this.sendMessage('comment.send.success', {
							comments: await this.wrapper.getTaskComments(message.data.taskId)
						});
					} else {
						this.sendMessage('comment.send.error');
						vscode.window.showInformationMessage(this.l10n.t("comment.sendError"));
					}
					break;
			}
		});
	}

	private async pushToWebview() {
		await this.fetchExtraData(this.task.list.id, this.task.space.id, this.task.id);
		this.sendMessage('task', {
			task: this.task,
			statuses: this.statuses,
			tags: this.tags,
			priorities: this.priorities,
			members: this.members,
			comments: this.comments
		});
	}

	/**
	 * @private
	 * @param {string} taskId
	 * @memberof EditWebview
	 */
	private async reloadTask(taskId: string) {
		this.task = await this.wrapper.getTask(taskId);
	}

	/**
	 * @private
	 * @param {Task} task
	 * @param {*} data
	 * @memberof EditWebview
	 */
	private async updateTask(task: Task, data: any) {
		const response = await this.wrapper.updateTask(task, data);
		if (!response) {
			vscode.window.showErrorMessage(constant.TASK_UPDATE_ERROR_MESSAGE);
			return false;
		}

		vscode.window.showInformationMessage(constant.TASK_UPDATE_MESSAGE);
		this.reloadTask(this.task.id);
		await this.pushToWebview(); // update data in webview
		this.listProvider.refresh();

		return true;
	}
}