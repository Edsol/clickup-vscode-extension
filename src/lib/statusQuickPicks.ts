import * as vscode from 'vscode';

export const confirmButton: vscode.QuickInputButton = {
    iconPath: new vscode.ThemeIcon('arrow-right'),
    tooltip: 'confirm',
};

export async function createQuickPick(items: vscode.QuickPickItem[], placeholder: string, totalSteps: any, activeItems: any = []) {
    return new Promise(function (resolve, reject) {
        const picker = vscode.window.createQuickPick();
        picker.placeholder = placeholder;
        picker.matchOnDescription = true;
        picker.matchOnDetail = true;
        // picker.ignoreFocusOut = true;
        picker.items = items;
        picker.activeItems = activeItems;
        picker.totalSteps = totalSteps;
        picker.show();
        picker.buttons = [vscode.QuickInputButtons.Back, confirmButton];

        picker.onDidAccept(function () {
            if (picker.activeItems.length) {
                picker.dispose();
                resolve(picker.activeItems[0]);
            }
        });
        picker.onDidTriggerButton(function (e) {
            if (e === confirmButton) {
                picker.dispose();
                resolve({
                    value: picker.value,
                    activeItems: picker.items[0],
                });
            }

            if (e === vscode.QuickInputButtons.Back) {
                picker.dispose();
                reject({
                    button: e,
                    value: picker.value,
                    activeItems: picker.activeItems,
                });
            }
        });
    });
}