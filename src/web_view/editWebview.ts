import * as vscode from 'vscode';
import * as path from 'path';
import { WebviewHelper } from './webviewHelper';
import { Task } from '../types';
import { ApiWrapper } from '../lib/apiWrapper';
import * as constant from '../constants';
import { TaskListProvider } from '../tree_view/taskListProvider';
import { isDark } from '../utils';

export class EditWebview {
	context: vscode.ExtensionContext;
	wrapper: ApiWrapper;
	panel: vscode.WebviewPanel;
	webviewhelper: any;
	htmlFile: string;

	dependecies: any;
	statuses: any;
	members: any;
	tags: any;
	priorities: any;

	constructor(context: vscode.ExtensionContext, task: Task, wrapper: ApiWrapper, provider: TaskListProvider) {
		// this.context = context;
		// this.wrapper = wrapper;

		console.log('isDark', isDark);

		const panel = vscode.window.createWebviewPanel(
			'editTask',
			task.name,
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);

		const updateWebview = () => {
			panel!.webview.html = this.getWebviewContent();
		};

		updateWebview();

		// Crea un watcher per ricaricare la WebView quando il file cambia
		const watcher = vscode.workspace.createFileSystemWatcher(
			new vscode.RelativePattern(context.extensionPath, '**/*.{ts,js,tsx}')
		);

		watcher.onDidChange(() => {
			updateWebview();  // Ricarica la WebView
		});

		context.subscriptions.push(watcher);
	}

	private getWebviewContent(scriptUri?: vscode.Uri) {
		const devServerUri = `http://localhost:3000/webview.js?v=${new Date().getTime()}`;

		return `<!DOCTYPE html>
		<html lang="en">
		<head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>React Webview</title>
		</head>
		<body>
		  <div id="app"></div>
		  <script src="${devServerUri}"></script>
		</body>
		</html>`;
	}

}