import * as vscode from 'vscode';
import * as path from 'path';
import * as http from 'http';
import { ApiWrapper } from '../../lib/apiWrapper';
import { TaskListProvider } from '../../tree_view/taskListProvider';
import { Member, Priority, Status, Tag, Comment, Task } from '../../types';
import { isDark } from '../../utils';
import { Configuration } from '../../lib/configuration';

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
    public comments: Comment[] | {};
    public statuses: Status[] | {};
    public tags: Tag[] | {};
    public priorities: Priority[] | {};
    protected configuration: Configuration = new Configuration();

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
        const updateWebview = async () => {
            this.panel!.webview.html = await this.getWebviewContent();
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
    public async getWebviewContent() {
        const appPath = vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'webview.js'));
        let appUri = this.panel.webview.asWebviewUri(appPath);

        // Determina se sei in modalità di debug
        const isDevelopment = this.context.extensionMode === vscode.ExtensionMode.Development;
        if (isDevelopment) {
            if (await this.isDevServerRunning() === false) {
                vscode.window.showErrorMessage('you are in development mode but a webpack server has not been started. Use `npm run start` to start one');
            }
            appUri = `http://localhost:3000/webview.js?v=${new Date().getTime()}`;
        }

        return `<!DOCTYPE html>
		<html lang="en">
		<head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>React Webview</title>
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${this.panel.webview.cspSource} https:; script-src ${this.panel.webview.cspSource} 'unsafe-inline' http: https:; style-src ${this.panel.webview.cspSource} 'unsafe-inline';">

		</head>
		<body>
		  <div id="app"></div>
		  <script src="${appUri}"></script>
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

    public async fetchExtraData(listId: string, spaceId: string, taskId?: string) {
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
            new Promise(async (resolve) => {
                if (!taskId) {
                    return {};
                }
                resolve(await this.wrapper.getTaskComments(taskId));
            }),
        ];

        await Promise.all(promises).then((values) => {
            [this.members, this.statuses, this.tags, this.priorities, this.comments] = values;
        });
    }

    isDevServerRunning = (): Promise<boolean> => {
        return new Promise((resolve) => {
            const options = {
                host: 'localhost',
                port: 3000,
                path: '/webview.js',
                timeout: 2000 // Timeout di 2 secondi
            };

            const req = http.request(options, (res) => {
                resolve(res.statusCode === 200);
            });

            req.on('error', () => {
                resolve(false);
            });

            req.end();
        });
    };


}