import * as vscode from 'vscode';
import { Task } from '../../types';
import { ApiWrapper } from '../../lib/apiWrapper';
import { TaskListProvider } from '../../tree_view/taskListProvider';
import { isDark } from '../../utils';
import * as constant from '../../constants';
import TaskWebview from './taskWebview';
import path from 'path';

export class EditWebview extends TaskWebview {
	task: Task;

	constructor(context: vscode.ExtensionContext, task: Task, wrapper: ApiWrapper, provider: TaskListProvider) {
		super(context, wrapper, provider);
		this.task = task;

		this.panel = vscode.window.createWebviewPanel(
			'editTask',
			task.name,
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);

		this.initPanel();
		this.fetchExtraData(task.list.id, task.space.id);
		this.messageHandler();
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
					this.pushToWebview();

					break;
				case 'save':
					await this.updateTask(this.task, message.data.task);
					break;
				case 'notification':
					if (message.type === 'success') {
						vscode.window.showInformationMessage(message.text);
					} else {
						vscode.window.showErrorMessage(message.text);
					}
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
		this.pushToWebview(); // update data in webview
		this.listProvider.refresh();

		return true;
	}
}