import * as path from 'path';
import * as vscode from 'vscode';
import { Member, Statuses, Tag, Priority } from '../types';

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

    static normalize(data: any, mapField: Array<String>) {
        if (data.assignees) {
            data.assignees = data.assignees.map((member: any) => {
                return member.id;
            });
        }
        if (data.status) {
            data.status = data.status.value;
        }
        if (data.priority) {
            data.priority = parseInt(data.priority.id);
        }
        if (data.tags) {
            data.tags = data.tags.map((tag: any) => {
                return tag.name;
            });
        }

        var filteredData: any = {};

        Object.entries(data).map((element: any) => {
            var key = element[0];
            var value = element[1];
            if (mapField.includes(key) && value !== null) {
                filteredData[key] = value;
            }
        });
        console.log('filteredData', filteredData);
        return filteredData;
    }

    static filterMembers(members: Array<Member>) {
        var result: Array<any> = [];
        for (var member of members) {
            result.push({
                id: member.id,
                value: member.username,
                name: member.username
            });
        }

        return result;
    }

    static filterStatuses(statuses: Array<Statuses>) {
        var result: Array<any> = [];
        for (var status of statuses) {
            result.push({
                id: status.id,
                value: status.status,
                name: status.status
            });
        }

        return result;
    }

    static filterTags(tags: Array<Tag>) {
        var result: Array<any> = [];
        for (var tag of tags) {
            result.push({
                value: tag.name,
                name: tag.name
            });
        }

        return result;
    }

    static filterPriorities(priorities: Array<Priority>) {
        var result: Array<any> = [];
        for (var priority of priorities) {
            result.push({
                id: priority.id,
                value: priority.priority,
                name: priority.priority
            });
        }

        return result;
    }
}