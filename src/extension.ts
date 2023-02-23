'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window, commands, Disposable, ExtensionContext } from 'vscode';
import Timer from './Timer';

let timer;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "timer" is now active!');

  timer = new Timer();

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let startTimer = commands.registerCommand('extension.startTimer', () => {
    timer.start();
  });

  let stopTimer = commands.registerCommand('extension.stopTimer', () => {
    timer.stop();
  });

  context.subscriptions.push(startTimer);
  context.subscriptions.push(stopTimer);
}

function validateTimerInput(value) {
  let numericValue = parseInt(value);
  if (isNaN(numericValue)) {
    return 'Minutes has to be in the form of a valid number';
  } else {
    return null;
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}