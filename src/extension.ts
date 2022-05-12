import * as constants from './constants';
import * as vscode from 'vscode';
import * as path from 'path';
import { ApiWrapper } from './api_wrapper';
import { LocalStorageService } from './localStorageService';
import * as tokenInput from './token/input';
import { tokenService } from './token/service';
import { Member, Statuses, StoredMembers, StoredStatuses, StoredTags, StoredPriorities, Tag, Priority, Space, List } from './types';
import { EditWebview } from './web_view/edit/editWebview';
import { TeamProviderProvider } from './tree_view/team_provider';


export async function activate(context: vscode.ExtensionContext) {
	console.time('Execution Time');
	let storageManager = new LocalStorageService(context.workspaceState);
	tokenService.init(storageManager);
	var token: any = await storageManager.getValue('token');

	if (token === undefined) {
		vscode.window.showInformationMessage('No clickup token has been set!');
		return;
	}
	var wrapper = new ApiWrapper(token);
	var teams = await wrapper.getTeams();

	var teamProvider = new TeamProviderProvider(teams, constants.DEFAULT_TASK_DETAILS, wrapper);
	vscode.window.createTreeView('clickupTasksView', { treeDataProvider: teamProvider });

	async function setToken() {
		if (await tokenInput.setToken()) {
			vscode.window.showInformationMessage('Your token has been successfully saved');
		}
	}

	async function getToken() {
		var token = await tokenInput.getToken();
		vscode.window.showInformationMessage('Your token is: ' + token);
	}

	function addTask(listItem: any) {
		// Create and show a new webview
		const newTaskPanel = vscode.window.createWebviewPanel(
			'newTask',
			'new Clickup task',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: []
			}
		);

		var uri = path.join(context.extensionPath, 'src', 'web_view', 'new.html');
		vscode.workspace.openTextDocument(uri).then((document) => {
			newTaskPanel.webview.html = document.getText();

			newTaskPanel.webview.postMessage({
				command: 'loadMembers',
				listItem: listItem
				// data: storedMembers.members
			});

			newTaskPanel.webview.onDidReceiveMessage(
				async message => {
					switch (message.command) {
						case "error":
							vscode.window.showErrorMessage(message.args);
							break;
						case "newTask":
							var response = await wrapper.newTask(message.args);
							vscode.window.showInformationMessage('newTask:' + response.id);
							newTaskPanel.dispose();
							break;
					}
				},
				undefined,
				context.subscriptions
			);
		});
	}

	vscode.commands.registerCommand('clickup.setToken', setToken);
	vscode.commands.registerCommand('clickup.getToken', getToken);
	vscode.commands.registerCommand('clickup.addTask', (element) => {
		addTask(element);
	});

	vscode.commands.registerCommand('clickup.editTask', (taskItem) => {
		new EditWebview(context, taskItem.task, wrapper);
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }