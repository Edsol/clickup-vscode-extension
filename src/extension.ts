import * as vscode from 'vscode';
import { LocalStorageService } from './localStorageService';
import * as tokenInput from './token/input';
import { tokenService } from './token/service';

export function activate(context: vscode.ExtensionContext) {
	let storageManager = new LocalStorageService(context.workspaceState);
	tokenService.init(storageManager);

	console.log('Congratulations, your extension "clickup" is now active!');

	let disposable = vscode.commands.registerCommand('clickup.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from clickup!');
	});

	context.subscriptions.push(disposable);

	vscode.commands.registerCommand('clickup.setToken', async () => {
		if (await tokenInput.setToken()) {
			vscode.window.showInformationMessage('Your token has been successfully saved');
		}
	});

	vscode.commands.registerCommand('clickup.getToken', async () => {
		var token = await tokenInput.getToken();
		vscode.window.showInformationMessage('Your token is: ' + token);
	});


}

// this method is called when your extension is deactivated
export function deactivate() { }
