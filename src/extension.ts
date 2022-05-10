import * as constants from './constants';
import * as vscode from 'vscode';
import * as path from 'path';
import { ApiWrapper } from './api_wrapper';
import { LocalStorageService } from './localStorageService';
import * as tokenInput from './token/input';
import { tokenService } from './token/service';
import { TasksDataProvider } from './tree_view/tasks_data_provider';
import { Member, Statuses, StoredMembers, StoredStatuses, StoredTags, StoredPriorities, Tag, Priority, Space } from './types';
import { EditWebview } from './web_view/edit/editWebview';
import { SpaceProviderProvider } from './tree_view/space_provider';


export async function activate(context: vscode.ExtensionContext) {
	let storageManager = new LocalStorageService(context.workspaceState);
	tokenService.init(storageManager);
	var token: any = await storageManager.getValue('token');

	if (token === undefined) {
		vscode.window.showInformationMessage('No clickup token has been set!');
		return;
	}
	var wrapper = new ApiWrapper(token);
	var spaces = await wrapper.getSpaces();

	var spaceProvider = new SpaceProviderProvider(spaces, constants.DEFAULT_TASK_DETAILS, wrapper);
	vscode.window.createTreeView('clickupTasksView', { treeDataProvider: spaceProvider });
	// var storedTasks: any = await storageManager.getValue(constants.TASKS_STORED_KEY);

	// if (storedTasks === undefined || storedTasks.length === 0) {
	// 	console.log('no tasks found');
	// 	var tasks = await wrapper.getAllTasks();
	// 	storeTasks(tasks);
	// }

	// var storedMembers: StoredMembers = await storageManager.getValue(constants.MEMBERS_STORED_KEY);

	// if (storedMembers === undefined || storedMembers.members.length === 0) {
	// 	console.log('no members found');
	// 	var members = await wrapper.getMembers();
	// 	storeMembers(members);
	// }

	// var storedStatuses: StoredStatuses = await storageManager.getValue(constants.STATUS_STORED_KEY);

	// if (storedStatuses === undefined || storedStatuses.statuses.length === 0) {
	// 	console.log('no status found');
	// 	var statuses = await wrapper.getStatus();
	// 	storedStatuses = storeStatuses(statuses);
	// }

	// var storedTags: StoredTags = await storageManager.getValue(constants.TAGS_STORED_KEY);
	// if (storedTags === undefined || storedTags.tags.length === 0) {
	// 	console.log('no tags found');
	// 	var tags = await wrapper.getTags();
	// 	storedTags = storeTags(tags);
	// }


	// var storedPriorities: StoredPriorities = await storageManager.getValue(constants.PRIORITIES_STORED_KEY);
	// if (storedPriorities === undefined || storedPriorities.priorities.length === 0) {
	// 	console.log('no priorities found');
	// 	var priorities = await wrapper.getPriorities();
	// 	storedPriorities = storePriorities(priorities);
	// }




	// buildProvider(storedTasks.tasks);

	// function buildProvider(tasks: any) {
	// 	var mainProvider = new TasksDataProvider(tasks, constants.DEFAULT_TASK_DETAILS);
	// 	vscode.window.createTreeView('clickupTasksView', { treeDataProvider: mainProvider });
	// }

	// async function reloadTasks() {
	// 	var tasks = await wrapper.getAllTasks();
	// 	buildProvider(tasks);
	// 	storeTasks(tasks);
	// }

	// function storeTasks(tasks: any) {
	// 	storageManager.setValue(constants.TASKS_STORED_KEY, {
	// 		time: Date.now(),
	// 		tasks: tasks
	// 	});
	// }

	// function storeMembers(members: Array<Member>) {
	// 	storageManager.setValue(constants.MEMBERS_STORED_KEY, {
	// 		time: Date.now(),
	// 		members: members
	// 	});
	// }

	// function storeStatuses(statuses: Array<Statuses>) {
	// 	var data = {
	// 		time: Date.now(),
	// 		statuses: statuses
	// 	};
	// 	storageManager.setValue(constants.STATUS_STORED_KEY, data);
	// 	return data;
	// }

	// function storeTags(tags: Array<Tag>) {
	// 	var data = {
	// 		time: Date.now(),
	// 		tags: tags
	// 	};
	// 	storageManager.setValue(constants.TAGS_STORED_KEY, data);
	// 	return data;
	// }

	// function storePriorities(priorities: Array<Priority>) {
	// 	var data = {
	// 		time: Date.now(),
	// 		priorities: priorities
	// 	};
	// 	storageManager.setValue(constants.PRIORITIES_STORED_KEY, data);
	// 	return data;
	// }



	// async function setToken() {
	// 	if (await tokenInput.setToken()) {
	// 		vscode.window.showInformationMessage('Your token has been successfully saved');
	// 	}
	// }

	// async function getToken() {
	// 	var token = await tokenInput.getToken();
	// 	vscode.window.showInformationMessage('Your token is: ' + token);
	// }

	// async function deleteTasks() {
	// 	storageManager.setValue(constants.TASKS_STORED_KEY, []);
	// 	vscode.window.showInformationMessage('Command was executed');
	// }

	// function newTask() {
	// 	// Create and show a new webview
	// 	const newTaskPanel = vscode.window.createWebviewPanel(
	// 		'newTask',
	// 		'new Clickup task',
	// 		vscode.ViewColumn.One,
	// 		{
	// 			enableScripts: true,
	// 			localResourceRoots: []
	// 		}
	// 	);

	// 	var uri = path.join(context.extensionPath, 'src', 'web_view', 'new.html');
	// 	vscode.workspace.openTextDocument(uri).then((document) => {
	// 		newTaskPanel.webview.html = document.getText();

	// 		newTaskPanel.webview.postMessage({
	// 			command: 'loadMembers',
	// 			data: storedMembers.members
	// 		});

	// 		newTaskPanel.webview.onDidReceiveMessage(
	// 			async message => {
	// 				switch (message.command) {
	// 					case "error":
	// 						vscode.window.showErrorMessage(message.args);
	// 						break;
	// 					case "newTask":
	// 						var response = await wrapper.newTask(message.args);
	// 						vscode.window.showInformationMessage('newTask:' + response.id);
	// 						newTaskPanel.dispose();
	// 						reloadTasks();
	// 						break;
	// 				}
	// 			},
	// 			undefined,
	// 			context.subscriptions
	// 		);
	// 	});
	// }

	// vscode.commands.registerCommand('clickup.setToken', setToken);
	// vscode.commands.registerCommand('clickup.getToken', getToken);
	// vscode.commands.registerCommand('clickup.deleteTasks', deleteTasks);
	// vscode.commands.registerCommand('clickup.refreshTasksList', reloadTasks);
	// vscode.commands.registerCommand('clickup.newTask', newTask);

	// vscode.commands.registerCommand('clickup.editTask', (taskItem) => {
	// 	new EditWebview(
	// 		context,
	// 		taskItem.task,
	// 		{
	// 			wrapper: wrapper,
	// 			members: storedMembers.members,
	// 			statuses: storedStatuses.statuses,
	// 			tags: storedTags.tags,
	// 			priorities: storedPriorities.priorities,
	// 		}
	// 	);
	// });
}

// this method is called when your extension is deactivated
export function deactivate() { }