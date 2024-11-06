import * as constants from './constants';
import * as vscode from 'vscode';
import { ApiWrapper } from './lib/apiWrapper';
import { LocalStorageService } from './lib/localStorageService';
import TokenManager from './lib/tokenManager';
import { EditWebview } from './webView/backend/editWebview';
import { TaskListProvider } from './tree_view/taskListProvider';
import { NewTaskWebview } from './webView/backend/newTaskWebview';
import { Utils } from './utils';
import { StatusChanger } from './lib/statusChanger';
import { TaskStatusBarItem } from './lib/taskStatusBarItem';
import { Configuration } from './lib/configuration';
import * as l10n from '@vscode/l10n';
import { TimesListProvider } from './tree_view/timesListProvider';
import { Team, User, Task, Time } from './types';
import { MyTaskListProvider } from './tree_view/mytaskListProvider';
import Timer from './lib/timer';

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
let selectedTaskData: Task | undefined;
let taskListProvider: TaskListProvider;
let timer: Timer;

/**
 *
 *
 * @export
 * @param {vscode.ExtensionContext} cntx
 * @return {*} 
 */
export async function activate(cntx: vscode.ExtensionContext) {
	context = cntx;
	storageManager = new LocalStorageService(context.workspaceState);
	tokenManager = new TokenManager(storageManager);
	const token = await tokenManager.init();
	const debugMode = configuration.get("debugMode");
	// initialize taskId an listId from storage
	selectedTaskData = await storageManager.getValue('selectedTaskData');

	// initialize the statusBarItem
	taskStatusBarItem = new TaskStatusBarItem();

	if (!token) {
		return;
	}
	//If token exists fetch data
	wrapper = new ApiWrapper(token);
	me = await wrapper.getUser();

	statusChanger = new StatusChanger(wrapper);

	// inizialize the TaskList tree
	const teams = await wrapper.getTeams();
	taskListProvider = new TaskListProvider(teams, constants.DEFAULT_TASK_DETAILS, wrapper, debugMode);
	initMyTaskTree(teams, `${me.id}`);

	vscode.window.createTreeView('tasksViewer', {
		treeDataProvider: taskListProvider,
		showCollapseAll: true,
	});

	if (selectedTaskData !== undefined) {
		taskFound(selectedTaskData);
	}

	// update icons after theme change
	vscode.window.onDidChangeActiveColorTheme(() => {
		myTaskProvider.refresh();
	});
}
/**
 *
 *
 * @param {Task} task
 */
async function taskFound(task: Task) {
	let localTask = task;
	// Checks that the saved task data is complete, if not, reloads it
	if (!Object.prototype.hasOwnProperty.call(task, 'url')) {
		const remoteTask = await wrapper.getTask(task.id);
		//save last TaskId and ListId value
		storageManager.setValue('selectedTaskData', remoteTask);
		localTask = remoteTask;
	}
	let message = `#${localTask.id}`;
	if (task.name && configuration.get("showTaskTitle")) {
		message += `(${localTask.name})`;
	}
	taskStatusBarItem.setText(taskStatusBarItem.defaultIconTaskSetted + message);
	taskStatusBarItem.setTooltip(constants.TASK_TOOLTIP);
	taskStatusBarItem.setCommand("clickup.removeTask");

	//save last TaskId and ListId value
	storageManager.setValue('selectedTaskData', localTask);

	if (wrapper) {
		if (configuration.get("trackTaskTime")) {
			timer = new Timer(
				localTask,
				wrapper,
				// start time callback
				() => { },
				// stop time callback
				() => {
					timesListProvider.refresh();
				});
			restoreTimer(localTask.team_id, localTask.id);
		}
		initTimeTrakerTree(localTask);
	}
}
/**
 *
 *
 * @param {string} teamId
 * @param {string} taskId
 */
function restoreTimer(teamId: string, taskId: string) {
	if (!teamId) {
		// console.log("No `teamId` found to restore time");
		return;
	}
	wrapper.getRunningTime(teamId).then((time: Time) => {
		if (time && time.task.id === taskId) {
			timer.restore(parseInt(time.start));
		}
	});
}
/**
 *
 *
 */
function forgetTask() {
	taskStatusBarItem.setDefaults();
	selectedTaskData = undefined;
	statusChanger.itemsList.task.id = undefined;
	storageManager.setValue('selectedTaskData', undefined);
	storageManager.setValue('listOfTaskId', undefined);
	vscode.window.showInformationMessage(constants.TASK_REMOVED);
	initTimeTrakerTree();
	timer.stop();
	timer.destroy();
}

/**
 *
 *
 * @param {Array<Team>} teams
 * @param {string} userId
 */
function initMyTaskTree(teams: Array<Team>, userId: string) {
	myTaskProvider = new MyTaskListProvider(wrapper, teams, userId);
	vscode.window.createTreeView('myTask', {
		treeDataProvider: myTaskProvider,
		showCollapseAll: true
	});

}

/**
 *
 *
 * @param {string} [taskId]
 */
function initTimeTrakerTree(task?: Task) {
	timesListProvider = new TimesListProvider(wrapper, task);
	vscode.window.createTreeView('timeTracker', {
		treeDataProvider: timesListProvider,
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
	taskFound(task);
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
	if (selectedTaskData.list.id === undefined) {
		vscode.window.showInformationMessage(constants.NO_LIST_ID);
		return;
	}

	const status = await statusChanger.showStatusQuickPick(selectedTaskData.list.id);
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
		taskFound(taskData);
	}
});

vscode.commands.registerCommand('clickup.removeTask', async () => {
	if (await statusChanger.removeTaskQuickPick() === 1) {
		forgetTask();
	}
});

// Time manager

vscode.commands.registerCommand('clickup.startTimer', () => {
	timer.start();
});
vscode.commands.registerCommand('clickup.stopTimer', () => {
	timer.stop();
});

// this method is called when your extension is deactivated
export function deactivate() { }