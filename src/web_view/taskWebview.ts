import * as vscode from 'vscode';

/**
 *
 *
 * @interface TaskWebvieInterface
 */
interface TaskWebvieInterface {
    initPanel(): void;
    getWebviewContent(scriptUri?: vscode.Uri): void;
    sendMessage(type: string, data: Object): void;
    messageHandler(): void;
}

/**
 *
 *
 * @export
 * @class TaskWebview
 * @implements {TaskWebvieInterface}
 */
export default class TaskWebview implements TaskWebvieInterface {

    /**
    * @memberof TaskWebview
    */
    public panel = undefined;

    /**
     * @memberof TaskWebview
     */
    public context = undefined;

    /**
     * Creates an instance of TaskWebview.
     * @memberof TaskWebview
     */
    constructor() { }

    /**
     * @memberof TaskWebview
     */
    public initPanel() {
        const updateWebview = () => {
            this.panel!.webview.html = this.getWebviewContent();
        };

        updateWebview();

        // Crea un watcher per ricaricare la WebView quando il file cambia
        const watcher = vscode.workspace.createFileSystemWatcher(
            new vscode.RelativePattern(this.context.extensionPath, '**/*.{ts,js,tsx}')
        );

        watcher.onDidChange(() => {
            updateWebview();  // Ricarica la WebView
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

}