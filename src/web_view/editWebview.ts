import * as vscode from 'vscode';
import * as path from 'path';
import { WebviewHelper } from '../webviewHelper';

export class EditWebview {
    context: vscode.ExtensionContext;
    panel: vscode.WebviewPanel;
    webviewhelper: WebviewHelper;

    dependecies: any;

    constructor(context: vscode.ExtensionContext, title: string, htmlFile: string) {
        this.context = context;

        this.dependecies = {
            bootstrapSrc: path.join(context.extensionPath, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css'),
            vueSrc: path.join(context.extensionPath, 'node_modules', 'vue', 'dist', 'vue.global.js'),
            tagifySrc: path.join(context.extensionPath, 'node_modules', '@yaireo', 'tagify', 'dist', 'tagify.min.js')
        };

        this.panel = vscode.window.createWebviewPanel(
            'editTask',
            title,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath, 'node_modules'))
                ]
            }
        );



        this.webviewhelper = new WebviewHelper(context, this.panel, htmlFile);
        this.webviewhelper.getPanel(this.dependecies, true).then((panel) => {
            this.panel = panel as vscode.WebviewPanel;
        });
    }

}