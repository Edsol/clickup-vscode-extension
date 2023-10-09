import * as vscode from 'vscode';

export const confirmButton: vscode.QuickInputButton = {
    iconPath: new vscode.ThemeIcon('arrow-right'),
    tooltip: 'confirm',
};

export async function createQuickPick(items: vscode.QuickPickItem[], placeholder: string, totalSteps: any) {
    return new Promise(function (resolve, reject) {
        const picker = vscode.window.createQuickPick();
        picker.placeholder = placeholder;
        picker.matchOnDescription = true;
        picker.matchOnDetail = true;
        picker.ignoreFocusOut = true;
        picker.items = items;
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
                if (picker.activeItems.length) {
                    resolve({
                        value: picker.value,
                        activeItems: picker.items[0],
                    });
                } else {
                    resolve({
                        value: picker.value,
                        activeItems: picker.items[0],
                    });
                }
                picker.dispose();
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

    // if (selectedStep) {
    //     currentStep.selection = selectedStep;
    //     console.log('selectedStep', selectedStep);
    //     // Avanza al passo successivo
    //     stepCounter++;
    //     if (stepCounter < steps.length) {
    //         currentStep = await <any>showQuickPick(stepCounter);
    //     } else {
    //         // Hai completato tutti i passaggi
    //         vscode.window.showInformationMessage('Hai completato tutti i passaggi.');
    //         stepCounter = 0; // Reimposta il passo a 0 per il prossimo utilizzo
    //         return currentStep;
    //     }
    // }
    // return steps;
}