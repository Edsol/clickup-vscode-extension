import * as vscode from 'vscode';

export class Configuration {
    configuration: vscode.WorkspaceConfiguration;
    constructor() {
        this.configuration = this.getConfiguration();
    }

    getConfiguration() {
        return vscode.workspace.getConfiguration('clickup');
    }

    get(key: string) {
        console.log(this.configuration);
        return this.configuration[key];
    }
}