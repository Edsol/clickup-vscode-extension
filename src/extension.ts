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
import { TaskStatusBarItem } from './lib/taskStatusBarItem';

export async function activate(context: vscode.ExtensionContext) {
	var utils = new Utils(vscode.window);
	let storageManager = new LocalStorageService(context.workspaceState);
	tokenService.init(storageManager);
	var token: any = await storageManager.getValue('token');

	const tokenRegex = /^[a-z]{2}[_]\d{5,8}[_].{32}/g;
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

	// initialize taskId an listId from storage
	var taskIdWorkingOn: any | undefined = await storageManager.getValue('taskIdWorkingOn');

	// initialize the statusBarItem
	var taskStatusBarItem = new TaskStatusBarItem();
	if (taskIdWorkingOn !== undefined) {
		console.log("Task was found:" + taskIdWorkingOn.id);
		taskFound(taskIdWorkingOn.id, taskIdWorkingOn.label);

	}
	function taskFound(taskId: string, label: string = '') {
		var message = `#${taskId}`;
		if (label) {
			message += `(${label})`;
		}
		taskStatusBarItem.setText(taskStatusBarItem.defaultIconTaskSetted + message);
		taskStatusBarItem.setTooltip("ClickUp Task you are working on");
		taskStatusBarItem.setCommand("clickup.removeTask");
	}

	function forgetTask() {
		taskStatusBarItem.setDefaults();
		taskIdWorkingOn = undefined;
		statusChanger.itemsList.task.id = undefined;
		storageManager.setValue('taskIdWorkingOn', undefined);
		storageManager.setValue('listOfTaskId', undefined);
		vscode.window.showInformationMessage(`Task was removed`);
	}

	vscode.commands.registerCommand('clickup.setToken', async () => {
		if (await tokenInput.setToken()) {
			vscode.window.showInformationMessage('Your token has been successfully saved');
			vscode.commands.executeCommand('workbench.action.reloadWindow');
		}
	});

	vscode.commands.registerCommand('clickup.deleteToken', async () => {
		if (await tokenInput.deleteToken()) {
			forgetTask();
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
		if (taskIdWorkingOn === undefined) {
			vscode.window.showInformationMessage(`No ClickUp task has been selected`);
		} else {
			var status = await statusChanger.showStatusQuickPick(taskIdWorkingOn.listId);
			if (status === undefined) {
				vscode.window.showInformationMessage(`I couldn't read the status`);
				return;
			}
			statusChanger.setGitMessage(`#${taskIdWorkingOn.id}[${status}]`);
		}
	});

	vscode.commands.registerCommand('clickup.taskChooser', async () => {
		if (taskIdWorkingOn === undefined) {
			var taskData = taskIdWorkingOn = await statusChanger.showTaskChooserQuickPick();

			taskFound(taskData.id, taskData.label);

			//save last TaskId and ListId value
			storageManager.setValue('taskIdWorkingOn', taskData);
		}
	});

	vscode.commands.registerCommand('clickup.removeTask', async () => {
		if (await statusChanger.removeTaskQuickPick() === 1) {
			forgetTask();
		}
	});

}

// this method is called when your extension is deactivated
export function deactivate() { }