import * as constants from './constants';
import * as vscode from 'vscode';
import { ApiWrapper } from './lib/apiWrapper';
import { LocalStorageService } from './lib/localStorageService';
import TokenManager from './lib/tokenManager';
import { EditWebview } from './web_view/editWebview';
import { TaskListProvider } from './tree_view/taskListProvider';
import { NewTaskWebview } from './web_view/newTaskWebview';
import { Utils } from './utils';
import { StatusChanger } from './lib/statusChanger';
import { TaskStatusBarItem } from './lib/taskStatusBarItem';
import { Configuration } from './lib/configuration';
import * as l10n from '@vscode/l10n';
import { TimesListProvider } from './tree_view/timesListProvider';
import { Team, User, SelectedTaskData } from './types';
import { MyTaskListProvider } from './tree_view/mytaskListProvider';
import { TeamItem } from './tree_view/items/team_item';
import Timer from './timer';

if (vscode.l10n.uri?.fsPath) {
	l10n.config({
		fsPath: vscode.l10n.uri?.fsPath
	});
}
let me: User;
const configuration: Configuration = new Configuration();
let tokenManager: TokenManager;
let context: vscode.ExtensionContext;
let storageManager: LocalStorageService;
let wrapper: ApiWrapper;
const utils = new Utils(vscode.window);
let timesListProvider: TimesListProvider;
let myTaskProvider: MyTaskListProvider;
let statusChanger: StatusChanger;
let taskStatusBarItem: TaskStatusBarItem;
let selectedTaskData: SelectedTaskData | undefined;
let taskListProvider: TaskListProvider;
let timer: Timer;
let isPausedManually: boolean;

export async function activate(cntx: vscode.ExtensionContext) {
	context = cntx;
	storageManager = new LocalStorageService(context.workspaceState);
	tokenManager = new TokenManager(storageManager);
	const token = await tokenManager.init();

	// initialize taskId an listId from storage
	selectedTaskData = await storageManager.getValue('selectedTaskData');

	// initialize the statusBarItem
	taskStatusBarItem = new TaskStatusBarItem();
	if (selectedTaskData !== undefined) {
		taskFound(selectedTaskData.id, selectedTaskData.label, selectedTaskData.listId);

	}

	if (!token) {
		return;
	}
	//If token exists fetch data
	wrapper = new ApiWrapper(token);
	me = await wrapper.getUser();

	statusChanger = new StatusChanger(wrapper);

	// inizialize the TaskList tree
	const teams = await wrapper.getTeams();
	taskListProvider = new TaskListProvider(teams, constants.DEFAULT_TASK_DETAILS, wrapper);
	initMyTaskTree(teams, `${me.id}`);

	vscode.window.createTreeView('tasksViewer', {
		treeDataProvider: taskListProvider,
		showCollapseAll: true,
	});

	if (selectedTaskData !== undefined) {
		taskFound(selectedTaskData.id, selectedTaskData.label, selectedTaskData.listId);
	}
	isPausedManually = false;

}

function taskFound(taskId: string, label: string, listId: number) {
	let message = `#${taskId}`;
	if (label && configuration.get("showTaskTitle")) {
		message += `(${label})`;
	}
	taskStatusBarItem.setText(taskStatusBarItem.defaultIconTaskSetted + message);
	taskStatusBarItem.setTooltip(constants.TASK_TOOLTIP);
	taskStatusBarItem.setCommand("clickup.removeTask");

	//save last TaskId and ListId value
	storageManager.setValue('selectedTaskData', {
		id: taskId,
		label: label,
		listId: listId
	});

	if (wrapper) {
		timer = new Timer();
		initTimeTrakerTree(taskId);
	}
}

function forgetTask() {
	taskStatusBarItem.setDefaults();
	selectedTaskData = undefined;
	statusChanger.itemsList.task.id = undefined;
	storageManager.setValue('selectedTaskData', undefined);
	storageManager.setValue('listOfTaskId', undefined);
	vscode.window.showInformationMessage(constants.TASK_REMOVED);
	initTimeTrakerTree();
}

function initTimeTrakerTree(taskId?: string) {
	timesListProvider = new TimesListProvider(wrapper, taskId);
	vscode.window.createTreeView('timeTracker', {
		treeDataProvider: timesListProvider,
		showCollapseAll: true
	});
}

function initMyTaskTree(teams: Array<Team>, userId: string) {
	myTaskProvider = new MyTaskListProvider(wrapper, teams, userId);
	vscode.window.createTreeView('myTask', {
		treeDataProvider: myTaskProvider,
		showCollapseAll: true
	});
}


vscode.commands.registerCommand('clickup.setToken', async () => {
	if (await tokenManager.askToken()) {
		vscode.window.showInformationMessage(constants.SET_TOKEN);
		vscode.commands.executeCommand('workbench.action.reloadWindow');
	}
});

vscode.commands.registerCommand('clickup.deleteToken', async () => {
	if (await tokenManager.delete()) {
		forgetTask();
		vscode.window.showInformationMessage(constants.DELETE_TOKEN);
		vscode.commands.executeCommand('workbench.action.reloadWindow');
	}
});

vscode.commands.registerCommand('clickup.getToken', async () => {
	const token = await tokenManager.getToken();
	if (token) {
		vscode.window.showInformationMessage(l10n.t('No token was found'));
		return;
	}
	vscode.window.showInformationMessage(l10n.t('Your token is: {token}', { token: token }));
});

vscode.commands.registerCommand('clickup.refresh', () => {
	taskListProvider.refresh();
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
});

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
	if (selectedTaskData === undefined) {
		vscode.window.showInformationMessage(constants.NO_TASK_SELECTED);
		return;
	}
	if (selectedTaskData.listId === undefined) {
		vscode.window.showInformationMessage(constants.NO_LIST_ID);
		return;
	}

	const status = await statusChanger.showStatusQuickPick(selectedTaskData.listId);
	if (status === undefined) {
		vscode.window.showInformationMessage(constants.STATUS_READ_ERROR);
		return;
	}
	statusChanger.setGitMessage(`#${selectedTaskData.id}[${status}]`);
});

vscode.commands.registerCommand('clickup.taskChooser', async () => {
	if (selectedTaskData === undefined) {
		const taskData = await statusChanger.showTaskChooserQuickPick();
		selectedTaskData = taskData;
		taskFound(taskData.id, taskData.label, taskData.listId);
	}
});

vscode.commands.registerCommand('clickup.removeTask', async () => {
	if (await statusChanger.removeTaskQuickPick() === 1) {
		forgetTask();
	}
});

// Time manager

vscode.commands.registerCommand('clickup.startTimer', () => {
	console.log('clickup command', 'start timer');
	isPausedManually = false;
	timer.start();
});
vscode.commands.registerCommand('clickup.stopTimer', () => {
	console.log('clickup command', 'stopTimer timer');
	isPausedManually = true;
	timer.stop();
});

// this method is called when your extension is deactivated
export function deactivate() { }