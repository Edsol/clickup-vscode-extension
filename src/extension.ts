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
	var wrapper = new ApiWrapper(token);

	vscode.window.registerTreeDataProvider('clickup-tasks', new TasksDataProvider(wrapper));

	let disposable = vscode.commands.registerCommand('clickup.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from clickup!');
	});

	context.subscriptions.push(disposable);

	vscode.commands.registerCommand('clickup.setToken', async () => {
		if (await tokenInput.setToken()) {
			vscode.window.showInformationMessage('Your token has been successfully saved');
		}
	});

	vscode.commands.registerCommand('clickup.getToken', async () => {
		var token = await tokenInput.getToken();
		vscode.window.showInformationMessage('Your token is: ' + token);
	});

	vscode.commands.registerCommand('clickup.getTasks', async () => {
		var wrapper = new ApiWrapper(token);
		var tasks = await wrapper.getAllTasks();
		console.log(tasks);
	});

}

// this method is called when your extension is deactivated
export function deactivate() { }
