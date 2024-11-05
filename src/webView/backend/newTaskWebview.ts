import * as vscode from 'vscode';
import { ApiWrapper } from '../../lib/apiWrapper';
import { ListItem } from '../../tree_view/items/list_item';
import * as constants from '../../constants';
import { TaskListProvider } from '../../tree_view/taskListProvider';
import TaskWebview from './taskWebview';
import { isDark } from '../../utils';
import { EditWebview } from './editWebview';

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
        this.panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'init':
                    this.sendMessage('theme', {
                        isDark: isDark()
                    });
                    break;
                case 'ready':
                    await this.pushToWebview();

                    break;
                case 'save':
                    await this.saveTask(message.data.task);
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
        const response = await this.wrapper.newTask(this.listId, data);
        if (!response) {
            vscode.window.showErrorMessage(constants.TASK_SAVE_ERROR_MESSAGE);
            return false;
        }
        vscode.window.showInformationMessage(constants.TASK_SAVE_SUCCESS_MESSAGE);
        this.listProvider.refresh();
        this.panel.dispose();

        if (this.configuration.get(constants.OPEN_TASK_AFTER_CREATED)) {
            new EditWebview(this.context, response, this.wrapper, this.listProvider);
        }
    }
}