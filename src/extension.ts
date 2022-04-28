import * as constants from './constants';
import * as vscode from 'vscode';
import * as path from 'path';
import { ApiWrapper } from './api_wrapper';
import { LocalStorageService } from './localStorageService';
import * as tokenInput from './token/input';
import { tokenService } from './token/service';
import { TasksDataProvider } from './tree_view/tasks_data_provider';
import { Member, StoredMembers } from './types';
import { TaskItem } from './tree_view/items/task_item';
import { EditWebview } from './web_view/editWebview';


export async function activate(context: vscode.ExtensionContext) {
	let storageManager = new LocalStorageService(context.workspaceState);
	tokenService.init(storageManager);
	var token: any = await storageManager.getValue('token');

	if (token === undefined) {
		vscode.window.showInformationMessage('No clickup token has been set!');
		return;
	}
	var wrapper = new ApiWrapper(token);
	var storedTasks: any = await storageManager.getValue(constants.TASKS_STORED_KEY);

	if (storedTasks === undefined || storedTasks.length === 0) {
		console.log('no tasks found');
		var tasks = await wrapper.getAllTasks();
		storeTasks(tasks);
	}

	var storedMembers: StoredMembers = await storageManager.getValue(constants.MEMBERS_STORED_KEY);

	if (storedMembers === undefined || storedMembers.members.length === 0) {
		console.log('no members found');
		var members = await wrapper.getMembers();
		storeMembers(members);
	}

	var wrapper = new ApiWrapper(token);
	var mainProvider;

	buildProvider(storedTasks.tasks);

	function buildProvider(tasks: any) {
		mainProvider = new TasksDataProvider(tasks, constants.DEFAULT_TASK_DETAILS);
		vscode.window.createTreeView('clickupTasksView', { treeDataProvider: mainProvider });
	}

	async function reloadTasks() {
		var tasks = await wrapper.getAllTasks();
		buildProvider(tasks);
		storeTasks(tasks);
	}

	function storeTasks(tasks: any) {
		storageManager.setValue(constants.TASKS_STORED_KEY, {
			time: Date.now(),
			tasks: tasks
		});
	}

	function storeMembers(members: Array<Member>) {
		storageManager.setValue(constants.MEMBERS_STORED_KEY, {
			time: Date.now(),
			members: members
		});
	}

	async function setToken() {
		if (await tokenInput.setToken()) {
			vscode.window.showInformationMessage('Your token has been successfully saved');
		}
	}

	async function getToken() {
		var token = await tokenInput.getToken();
		vscode.window.showInformationMessage('Your token is: ' + token);
	}

	async function deleteTasks() {
		storageManager.setValue(constants.TASKS_STORED_KEY, []);
		vscode.window.showInformationMessage('Command was executed');
	}

	function newTask() {
		// Create and show a new webview
		const newTaskPanel = vscode.window.createWebviewPanel(
			'newTask',
			'new Clickup task',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: []
			}
		);

		var uri = path.join(context.extensionPath, 'src', 'web_view', 'new.html');
		vscode.workspace.openTextDocument(uri).then((document) => {
			newTaskPanel.webview.html = document.getText();

			newTaskPanel.webview.postMessage({
				command: 'loadMembers',
				data: storedMembers.members
			});

			newTaskPanel.webview.onDidReceiveMessage(
				async message => {
					switch (message.command) {
						case "error":
							vscode.window.showErrorMessage(message.args);
							break;
						case "newTask":
							var response = await wrapper.newTask(message.args);
							vscode.window.showInformationMessage('newTask:' + response.id);
							newTaskPanel.dispose();
							reloadTasks();
							break;
					}
				},
				undefined,
				context.subscriptions
			);
		});
	}

	vscode.commands.registerCommand('clickup.setToken', setToken);
	vscode.commands.registerCommand('clickup.getToken', getToken);
	vscode.commands.registerCommand('clickup.deleteTasks', deleteTasks);
	vscode.commands.registerCommand('clickup.refreshTasksList', reloadTasks);
	vscode.commands.registerCommand('clickup.newTask', newTask);

	vscode.commands.registerCommand('clickup.editTask', (taskItem) => {
		new EditWebview(
			context,
			taskItem.task,
			{
				members: storedMembers.members,
				wrapper: wrapper
			}
		);
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }