import * as vscode from 'vscode';

const DEFAULT_COMMAND = 'clickup.taskChooser';
const DEFAULT_TEXT = `$(megaphone) ClickUp task`;
const DEFAULT_TOOLTIP = "Choose a task";

export class TaskStatusBarItem {
    taskItem;

    constructor() {
        this.taskItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.setDefaults();
        // this.taskItem.show();
    }

    setCommand(command: string) {
        this.taskItem.command = command;
    }

    setText(text: string) {
        this.taskItem.text = text;
    }
    setTooltip(text: string) {
        this.taskItem.tooltip = text;
    }

    setDefaults() {
        this.setCommand(DEFAULT_COMMAND);
        this.setText(DEFAULT_TEXT);
        this.setTooltip(DEFAULT_TOOLTIP);
        this.taskItem.show();
    }
}