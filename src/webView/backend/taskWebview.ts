import * as vscode from 'vscode';
import * as path from 'path';
import { ApiWrapper } from '../../lib/apiWrapper';
import { TaskListProvider } from '../../tree_view/taskListProvider';
import { Member, Priority, Status, Tag } from '../../types';
import { isDark } from '../../utils';

abstract class TaskWebviewInterface {
    // Metodo astratto che le classi derivate devono implementare
    public abstract initPanel(): void;
    public abstract getWebviewContent(scriptUri?: vscode.Uri): void;
    public abstract sendMessage(type: string, data: Object): void;
    public abstract messageHandler(): void;
}

/**
 *
 *
 * @export
 * @class TaskWebview
 * @implements {TaskWebvieInterface}
 */
export default class TaskWebview implements TaskWebviewInterface {

    /**
    * @memberof TaskWebview
    */
    public panel = undefined;

    /**
     * @memberof TaskWebview
     */
    public context: vscode.ExtensionContext;
    public wrapper: ApiWrapper;
    public listProvider: TaskListProvider;

    public members: Member[] | {};
    public statuses: Status[] | {};
    public tags: Tag[] | {};
    public priorities: Priority[] | {};

    /**
     * Creates an instance of TaskWebview.
     * @memberof TaskWebview
     */
    constructor(context: vscode.ExtensionContext, wrapper: ApiWrapper, provider: TaskListProvider) {
        this.context = context;
        this.wrapper = wrapper;
        this.listProvider = provider;

        // update icons after theme change
        vscode.window.onDidChangeActiveColorTheme((value) => {
            this.sendMessage('theme', {
                isDark: isDark()
            });
        });
    }

    /**
     * @memberof TaskWebview
     */
    public initPanel() {
        const updateWebview = () => {
            this.panel!.webview.html = this.getWebviewContent();
        };

        updateWebview();

        // watcher
        const watcher = vscode.workspace.createFileSystemWatcher(
            new vscode.RelativePattern(this.context.extensionPath, '**/*.{ts,js,tsx}')
        );

        watcher.onDidChange(() => {
            updateWebview();  // reload WebView when files are changed
        });

        this.context.subscriptions.push(watcher);
    }


    /**
     *
     *
     * @param {vscode.Uri} [scriptUri]
     * @return {*} 
     * @memberof TaskWebview
     */
    public getWebviewContent(scriptUri?: vscode.Uri) {
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


    /**
     *
     *
     * @param {string} command
     * @param {Object} data
     * @return {*} 
     * @memberof TaskWebview
     */
    async sendMessage(command: string, data: Object) {
        return await this.panel.webview.postMessage({
            command: command,
            data: data
        });
    }


    /**
     *
     *
     * @memberof TaskWebview
     */
    public messageHandler() { }

    public async fetchExtraData(listId: string, spaceId: string) {
        const promises = [
            new Promise(async (resolve) => {
                resolve(await this.wrapper.getMembers(listId));
            }),
            new Promise(async (resolve) => {
                resolve(await this.wrapper.getStatus(listId));
            }),
            new Promise(async (resolve) => {
                resolve(await this.wrapper.getTags(spaceId));
            }),
            new Promise(async (resolve) => {
                resolve(await this.wrapper.getPriorities(spaceId));
            }),
        ];

        await Promise.all(promises).then((values) => {
            [this.members, this.statuses, this.tags, this.priorities] = values;
        });
    }

}