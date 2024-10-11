import * as vscode from 'vscode';
import { Task } from '../types';
import { ApiWrapper } from '../lib/apiWrapper';
import { TaskListProvider } from '../tree_view/taskListProvider';
import { isDark } from '../utils';
import * as constant from '../constants';
import TaskWebview from './taskWebview';

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

		this.fetchExtraData(task.list.id, task.space.id);
		this.initPanel();
		this.messageHandler();
	}

	messageHandler() {
		this.panel.webview.onDidReceiveMessage(message => {
			switch (message.command) {
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