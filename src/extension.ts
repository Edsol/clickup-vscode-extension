import * as constants from './constants';
import * as vscode from 'vscode';
import { ApiWrapper } from './api_wrapper';
import { LocalStorageService } from './localStorageService';
import * as tokenInput from './token/input';
import { tokenService } from './token/service';
import { EditWebview } from './web_view/editWebview';
import { TaskListProvider } from './tree_view/taskListProvider';
import { NewTaskWebview } from './web_view/newTaskWebview';
import { Utils } from './utils';
import { StatusChanger } from './statusChanger';
import { TaskStatusBarItem } from './lib/taskStatusBarItem';
import { Configuration } from './configuration';
import * as l10n from '@vscode/l10n';
import { TimesListProvider } from './tree_view/timesListProvider';

if (vscode.l10n.uri?.fsPath) {
	l10n.config({
		fsPath: vscode.l10n.uri?.fsPath
	});
}

export async function activate(context: vscode.ExtensionContext) {
	var utils = new Utils(vscode.window);
	let storageManager = new LocalStorageService(context.workspaceState);

	tokenService.init(storageManager);
	var token: any = await storageManager.getValue('token');
	const tokenRegex = /^[a-z]{2}[_]\d+[_].{32}/g;

	var wrapper: ApiWrapper;
	var statusChanger: StatusChanger;
	var configuration: Configuration = new Configuration();

	// initialize taskId an listId from storage
	var taskIdWorkingOn: any | undefined = await storageManager.getValue('taskIdWorkingOn');

	// initialize the statusBarItem
	var taskStatusBarItem = new TaskStatusBarItem();
	if (taskIdWorkingOn !== undefined) {
		console.log('taskIdWorkingOn', taskIdWorkingOn);
		taskFound(taskIdWorkingOn.id, taskIdWorkingOn.label, taskIdWorkingOn.listId);

	}

	// If token doesn't exists show error message
	if (token === undefined) {
		vscode.window.showInformationMessage(constants.NO_CLICKUP_TOKEN_SET);
	} else if (token.match(tokenRegex) === null) {
		vscode.window.showInformationMessage(l10n.t('Invalid Token!'));
	} else {
		//If token exists fetch informations
		wrapper = new ApiWrapper(token);
		statusChanger = new StatusChanger(wrapper);

		try {
			// inizialize the TaskList tree
			var teams = await wrapper.getTeams();
			var taskListProvider = new TaskListProvider(teams, constants.DEFAULT_TASK_DETAILS, wrapper);
			vscode.window.createTreeView('tasksViewer', {
				treeDataProvider: taskListProvider,
				showCollapseAll: true,
			});

			// inizialize the TimesList tree
			var timesListProvider = new TimesListProvider(taskIdWorkingOn.id, wrapper);
			vscode.window.createTreeView('timeTracker', {
				treeDataProvider: timesListProvider,
				showCollapseAll: true,
			});
		} catch (error) {
			console.log("Errors", error);
			return;
		}
	}

	function taskFound(taskId: string, label: string = '', listId: number) {
		var message = `#${taskId}`;
		if (label && configuration.get("showTaskTitle")) {
			message += `(${label})`;
		}
		taskStatusBarItem.setText(taskStatusBarItem.defaultIconTaskSetted + message);
		taskStatusBarItem.setTooltip(constants.TASK_TOOLTIP);
		taskStatusBarItem.setCommand("clickup.removeTask");

		//save last TaskId and ListId value
		storageManager.setValue('taskIdWorkingOn', {
			id: taskId,
			label: label,
			listId: listId
		});
	}

	function forgetTask() {
		taskStatusBarItem.setDefaults();
		taskIdWorkingOn = undefined;
		statusChanger.itemsList.task.id = undefined;
		storageManager.setValue('taskIdWorkingOn', undefined);
		storageManager.setValue('listOfTaskId', undefined);
		vscode.window.showInformationMessage(constants.TASK_REMOVED);
	}

	vscode.commands.registerCommand('clickup.setToken', async () => {
		if (await tokenInput.setToken()) {
			vscode.window.showInformationMessage(constants.SET_TOKEN);
			vscode.commands.executeCommand('workbench.action.reloadWindow');
		}
	});

	vscode.commands.registerCommand('clickup.deleteToken', async () => {
		if (await tokenInput.deleteToken()) {
			forgetTask();
			vscode.window.showInformationMessage(constants.DELETE_TOKEN);
			vscode.commands.executeCommand('workbench.action.reloadWindow');
		}
	});

	vscode.commands.registerCommand('clickup.refresh', () => {
		taskListProvider.refresh();
	});

	vscode.commands.registerCommand('clickup.getToken', async () => {
		var token = await tokenInput.getToken();
		vscode.window.showInformationMessage(l10n.t('Your token is: {token}', { token: token }));
	});

	vscode.commands.registerCommand('clickup.addTask', (listItem) => {
		new NewTaskWebview(context, listItem, wrapper, taskListProvider);
	});

	vscode.commands.registerCommand('clickup.editTask', (taskItem) => {
		new EditWebview(context, taskItem.task, wrapper, taskListProvider);
	});

	vscode.commands.registerCommand('clickup.deleteTask', (taskItem) => {
		utils.confirmDialog(constants.TASK_DELETE_MESSAGE, async () => {
			await wrapper.deleteTask(taskItem.task.id);
			taskListProvider.refresh();
		}, () => {
			vscode.window.showInformationMessage(l10n.t("The task was deleted correctly"));
		});
	});

	vscode.commands.registerCommand('clickup.workOnTask', (taskItem) => {
		const task = taskItem.task;
		taskFound(task.id, task.name, task.list.id);
	})

	vscode.commands.registerCommand('clickup.addSpace', (teamItem) => {
		vscode.window.showInputBox({
			prompt: "Insert space name"
		}).then(async (name) => {
			await wrapper.createSpace(teamItem.id, name as string);
			taskListProvider.refresh();
		});
	});

	vscode.commands.registerCommand("clickup.deleteSpace", (spaceItem) => {
		utils.confirmDialog(constants.SPACE_DELETE_MESSAGE, async () => {
			await wrapper.deleteSpace(spaceItem.id);
			taskListProvider.refresh();
		});
	});

	vscode.commands.registerCommand('clickup.addList', (spaceItem) => {
		vscode.window.showInputBox({
			prompt: "Insert list name"
		}).then(async (name) => {
			await wrapper.createList(spaceItem.id, name as string);
			taskListProvider.refresh();
		});
	});

	vscode.commands.registerCommand("clickup.deleteList", (listItem) => {
		utils.confirmDialog(constants.SPACE_DELETE_MESSAGE, async () => {
			await wrapper.deleteList(listItem.id);
			taskListProvider.refresh();
		});
	});

	vscode.commands.registerCommand('clickup.statusChanger', async () => {
		if (taskIdWorkingOn === undefined) {
			vscode.window.showInformationMessage(constants.NO_TASK_SELECTED);
		} else {
			var status = await statusChanger.showStatusQuickPick(taskIdWorkingOn.listId);
			if (status === undefined) {
				vscode.window.showInformationMessage(constants.STATUS_READ_ERROR);
				return;
			}
			statusChanger.setGitMessage(`#${taskIdWorkingOn.id}[${status}]`);
		}
	});

	vscode.commands.registerCommand('clickup.taskChooser', async () => {
		if (taskIdWorkingOn === undefined) {
			var taskData = taskIdWorkingOn = await statusChanger.showTaskChooserQuickPick();
			taskFound(taskData.id, taskData.label, taskData.listId);
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