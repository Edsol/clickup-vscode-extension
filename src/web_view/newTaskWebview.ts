import * as vscode from 'vscode';
import { ApiWrapper } from '../lib/apiWrapper';
import { ListItem } from '../tree_view/items/list_item';
import * as constants from './../constants';
import { TaskListProvider } from '../tree_view/taskListProvider';
import TaskWebview from './taskWebview';

export class NewTaskWebview extends TaskWebview {
    listId: string;

    constructor(context: vscode.ExtensionContext, listItem: ListItem, wrapper: ApiWrapper, provider: TaskListProvider) {
        super(context, wrapper, provider);

        this.panel = vscode.window.createWebviewPanel(
            'newTask',
            'new task',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        const list = listItem.list;
        this.listId = list.id;
        this.fetchExtraData(list.id, list.space.id);
        this.initPanel();
        this.messageHandler();
    }

    messageHandler() {
        this.panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'init':
                    this.sendMessage('theme', {
                        isDark: false
                    });
                    break;
                case 'ready':
                    this.pushToWebview();

                    break;
                case 'save':
                    this.saveTask(message.data.task);
                    break;
            }
        });
    }

    private pushToWebview() {
        this.sendMessage('task', {
            task: {},
            statuses: this.statuses,
            tags: this.tags,
            priorities: this.priorities,
            members: this.members
        });
    }

    private async saveTask(data: any) {
        var response = await this.wrapper.newTask(this.listId, data);
        if (response.id) {
            vscode.window.showInformationMessage(constants.TASK_SAVE_SUCCESS_MESSAGE);
            this.panel.dispose();
        } else {
            vscode.window.showErrorMessage(constants.TASK_SAVE_ERROR_MESSAGE);
        }
    }
}