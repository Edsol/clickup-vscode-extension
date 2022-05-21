import * as constants from './constants';
import * as vscode from 'vscode';
import { ApiWrapper } from './api_wrapper';
import { LocalStorageService } from './localStorageService';
import * as tokenInput from './token/input';
import { tokenService } from './token/service';
import { EditWebview } from './web_view/edit/editWebview';
import { MainProvider } from './tree_view/main_provider';
import { NewTaskWebview } from './web_view/new/newTaskWebview';
import { Utils } from './utils';


export async function activate(context: vscode.ExtensionContext) {
	var utils = new Utils(vscode.window);
	let storageManager = new LocalStorageService(context.workspaceState);
	tokenService.init(storageManager);
	var token: any = await storageManager.getValue('token');
	console.log('token', token);
	// If token doesn't exists show error message
	if (token === undefined) {
		vscode.window.showInformationMessage('No clickup token has been set!');
	} else {
		//If token exists fetch informations
		var wrapper = new ApiWrapper(token);
		var teams = await wrapper.getTeams();

		var provider = new MainProvider(teams, constants.DEFAULT_TASK_DETAILS, wrapper);
		vscode.window.createTreeView('clickupTasksView', {
			treeDataProvider: provider,
			showCollapseAll: true,
		});
	}
	vscode.commands.registerCommand('clickup.setToken', async () => {
		console.log('setToken');
		if (await tokenInput.setToken()) {
			vscode.window.showInformationMessage('Your token has been successfully saved');
			vscode.commands.executeCommand('workbench.action.reloadWindow');
		}
	});

	vscode.commands.registerCommand('clickup.deleteToken', async () => {
		if (await tokenInput.deleteToken()) {
			vscode.window.showInformationMessage('Your token has been successfully deleted');
			vscode.commands.executeCommand('workbench.action.reloadWindow');
		}
	});

	vscode.commands.registerCommand('clickup.refresh', () => {
		provider.refresh();
	});

	vscode.commands.registerCommand('clickup.getToken', async () => {
		var token = await tokenInput.getToken();
		vscode.window.showInformationMessage('Your token is: ' + token);
	});

	vscode.commands.registerCommand('clickup.addTask', (listItem) => {
		new NewTaskWebview(context, listItem, wrapper, provider);
	});

	vscode.commands.registerCommand('clickup.editTask', (taskItem) => {
		new EditWebview(context, taskItem.task, wrapper, provider);
	});

	vscode.commands.registerCommand('clickup.deleteTask', (taskItem) => {
		utils.confirmDialog(constants.TASK_DELETE_MESSAGE, async () => {
			await wrapper.deleteTask(taskItem.task.id);
			provider.refresh();
		}, () => {
			vscode.window.showInformationMessage('good, your task is safe');
		});
	});

	vscode.commands.registerCommand('clickup.addSpace', (teamItem) => {
		vscode.window.showInputBox({
			prompt: "Insert space name"
		}).then(async (name) => {
			console.log('response', name, teamItem.id);
			await wrapper.createSpace(teamItem.id, name as string);
			provider.refresh();
		});
	});

	vscode.commands.registerCommand("clickup.deleteSpace", (spaceItem) => {
		utils.confirmDialog(constants.SPACE_DELETE_MESSAGE, async () => {
			await wrapper.deleteSpace(spaceItem.id);
			provider.refresh();
		});
	});

	vscode.commands.registerCommand('clickup.addList', (spaceItem) => {
		console.log('addList', spaceItem);
		vscode.window.showInputBox({
			prompt: "Insert list name"
		}).then(async (name) => {
			console.log('response', name, spaceItem.id);
			await wrapper.createList(spaceItem.id, name as string);
			provider.refresh();
		});
	});

	vscode.commands.registerCommand("clickup.deleteList", (listItem) => {
		utils.confirmDialog(constants.SPACE_DELETE_MESSAGE, async () => {
			await wrapper.deleteList(listItem.id);
			provider.refresh();
		});
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }