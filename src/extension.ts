import * as constants from './constants';
import * as vscode from 'vscode';
import { ApiWrapper } from './api_wrapper';
import { LocalStorageService } from './localStorageService';
import * as tokenInput from './token/input';
import { tokenService } from './token/service';
import { EditWebview } from './web_view/editWebview';
import { MainProvider } from './tree_view/main_provider';
import { NewTaskWebview } from './web_view/newTaskWebview';
import { Utils } from './utils';
import { StatusChanger } from './statusChanger';

export async function activate(context: vscode.ExtensionContext) {
	var utils = new Utils(vscode.window);
	let storageManager = new LocalStorageService(context.workspaceState);
	tokenService.init(storageManager);
	var token: any = await storageManager.getValue('token');
	const tokenRegex = /^[a-z]{2}[_]\d{8}[_].{32}/g;
	var wrapper: ApiWrapper;
	var statusChanger: StatusChanger;

	// If token doesn't exists show error message
	if (token === undefined) {
		vscode.window.showInformationMessage('No clickup token has been set!');
	} else if (token.match(tokenRegex) === null) {
		vscode.window.showInformationMessage('Token was malformed!');
	} else {
		//If token exists fetch informations
		wrapper = new ApiWrapper(token);
		statusChanger = new StatusChanger(wrapper);
		try {
			var teams = await wrapper.getTeams();
			var provider = new MainProvider(teams, constants.DEFAULT_TASK_DETAILS, wrapper);
			vscode.window.createTreeView('clickupTasksView', {
				treeDataProvider: provider,
				showCollapseAll: true,
			});
		} catch (error) {
			console.log("Errors", error);
			return;
		}
	}

	var taskIdWorkingOn: string | undefined = undefined;
	var listOfTaskId: string | undefined = undefined;
	// create a new status bar item that we can now manage
	const taskChooser = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	taskChooser.command = 'clickup.taskChooser';
	// context.push(myStatusBarItem);
	taskChooser.text = `$(megaphone) ClickUp task`;
	taskChooser.tooltip = "Choose a task";
	taskChooser.show();

	vscode.commands.registerCommand('clickup.setToken', async () => {
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
		vscode.window.showInputBox({
			prompt: "Insert list name"
		}).then(async (name) => {
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

	vscode.commands.registerCommand('clickup.statusChanger', async () => {
		if (taskIdWorkingOn === undefined || listOfTaskId === undefined) {
			vscode.window.showInformationMessage(`No ClickUp task has been selected`);
		} else {
			var status = await statusChanger.showStatusQuickPick(listOfTaskId);
			statusChanger.setGitMessage(`#${taskIdWorkingOn}[${status}]`);
		}
	});
	vscode.commands.registerCommand('clickup.taskChooser', async () => {
		var { taskId, listId } = await statusChanger.showTaskChooserQuickPick();
		taskIdWorkingOn = taskId;
		listOfTaskId = listId;
		taskChooser.text = `#${taskIdWorkingOn}`;
		taskChooser.tooltip = "ClickUp Task you are working on";
	});

}

// this method is called when your extension is deactivated
export function deactivate() { }