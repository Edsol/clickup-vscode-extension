import * as vscode from 'vscode';

export class TaskStatusBarItem {
    taskItem;

    readonly defaultCommand = 'clickup.taskChooser';
    readonly defaultIcon = '$(zoom-in) ';
    readonly defaultIconTaskSetted = '$(bookmark) ';
    readonly defaultText = `ClickUp task`;
    readonly defaultTooltip = "Choose a task";

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
        this.setCommand(this.defaultCommand);
        this.setText(this.defaultIcon + this.defaultText);
        this.setTooltip(this.defaultTooltip);
        this.taskItem.show();
    }
}