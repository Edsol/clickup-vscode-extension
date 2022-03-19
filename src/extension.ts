import * as vscode from 'vscode';
import * as tokenInput from './token/input';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "clickup" is now active!');

	let disposable = vscode.commands.registerCommand('clickup.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from clickup!');
	});

	vscode.commands.registerCommand('clickup.setToken', async () => {
		await tokenInput.showInput();

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
