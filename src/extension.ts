import * as constants from './constants';
import * as vscode from 'vscode';
import { ApiWrapper } from './api_wrapper';
import { LocalStorageService } from './localStorageService';
import * as tokenInput from './token/input';
import { tokenService } from './token/service';
import { TasksDataProvider } from './tree_view/tasks_data_provider';

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

	if (storedTasks === undefined) {
		console.log('no tasks found');
		var tasks = await wrapper.getAllTasks();
		storageManager.setValue(constants.TASKS_STORED_KEY, {
			time: Date.now(),
			tasks: tasks
		});
	} else {
		console.log('tasks founds:', storedTasks);
	}
	var wrapper = new ApiWrapper(token);


	var tasksDataProvider = new TasksDataProvider(storedTasks.tasks);
	vscode.window.createTreeView('clickupTasksView', { treeDataProvider: tasksDataProvider });

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

	vscode.commands.registerCommand('clickup.setToken', await setToken);
	vscode.commands.registerCommand('clickup.getToken', await getToken);
	vscode.commands.registerCommand('deleteTasks', await deleteTasks);

}

// this method is called when your extension is deactivated
export function deactivate() { }