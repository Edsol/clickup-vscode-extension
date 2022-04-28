import * as path from 'path';
import * as vscode from 'vscode';

export class WebviewHelper {
    context: vscode.ExtensionContext;
    panel: vscode.WebviewPanel;
    uri: any;
    file: any;
    html: string = '';

    constructor(context: vscode.ExtensionContext, panel: vscode.WebviewPanel, filePath: string) {
        this.context = context;
        this.panel = panel;
        this.uri = path.join(filePath);
        this.file = vscode.Uri.file(this.uri);
    }

    async loadFile() {
        return new Promise((resolve, reject) => {
            vscode.workspace.openTextDocument(this.uri)
                .then((document) => {
                    this.html = document.getText();
                    resolve(true);
                });
        });
    }

    async getPanel(scripts?: any, verbose: boolean = false) {
        return new Promise(async (resolve) => {
            await this.loadFile();
            this.panel.webview.html = await this.injectScripts(scripts, verbose);
            resolve(this.panel);
        });
    }

    private async injectScripts(scripts: any, verbose: boolean) {
        if (scripts) {
            for (const scriptName in scripts) {
                var file = scripts[scriptName];
                const localFile = this.panel.webview.asWebviewUri(vscode.Uri.file(file));
                if (verbose) {
                    console.log('inject in ' + scriptName, localFile.toString());
                }
                this.html = this.html.replace("${" + scriptName + "}", localFile.toString());
            }
        }
        return this.html;
    }
}