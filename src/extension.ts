import * as constants from './constants';
import * as vscode from 'vscode';
import { ApiWrapper } from './api_wrapper';
import { LocalStorageService } from './localStorageService';
import * as tokenInput from './token/input';
import { tokenService } from './token/service';
import { EditWebview } from './web_view/edit/editWebview';
import { MainProvider } from './tree_view/main_provider';
import { NewTaskWebview } from './web_view/new/newTaskWebview';


export async function activate(context: vscode.ExtensionContext) {
	let storageManager = new LocalStorageService(context.workspaceState);
	tokenService.init(storageManager);
	var token: any = await storageManager.getValue('token');

	// If token doesn't exists show error message
	if (token === undefined) {
		vscode.window.showInformationMessage('No clickup token has been set!');
		return;
	}

	// If token exists fetch informations
	var wrapper = new ApiWrapper(token);
	var teams = await wrapper.getTeams();

	var provider = new MainProvider(teams, constants.DEFAULT_TASK_DETAILS, wrapper);
	vscode.window.createTreeView('clickupTasksView', { treeDataProvider: provider });

	vscode.commands.registerCommand('clickup.setToken', async () => {
		if (await tokenInput.setToken()) {
			vscode.window.showInformationMessage('Your token has been successfully saved');
		}
	});
	vscode.commands.registerCommand('clickup.getToken', async () => {
		var token = await tokenInput.getToken();
		vscode.window.showInformationMessage('Your token is: ' + token);
	});

	vscode.commands.registerCommand('clickup.addTask', (listItem) => {
		new NewTaskWebview(context, listItem, wrapper);
	});

	vscode.commands.registerCommand('clickup.editTask', (taskItem) => {
		new EditWebview(context, taskItem.task, wrapper);
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }