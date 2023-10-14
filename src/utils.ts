import * as vscode from 'vscode';
import * as l10n from '@vscode/l10n';

if (vscode.l10n.uri?.fsPath) {
    l10n.config({
        fsPath: vscode.l10n.uri?.fsPath
    });
}

export class Utils {
    window: any;

    constructor(window: any) {
        this.window = window;
    }

    confirmDialog(message: string, yesCallback?: CallableFunction, noCallable?: CallableFunction) {
        this.window.showInformationMessage(l10n.t("Are you sure you want to eliminate this task?"), l10n.t("Yes"), l10n.t("No"))
            .then((answer: string) => {
                if (answer === l10n.t("Yes")) {
                    if (yesCallback) {
                        yesCallback();
                    }
                } else {
                    if (noCallable) {
                        noCallable();
                    }
                }
            });
    }
}