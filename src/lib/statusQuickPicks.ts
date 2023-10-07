import * as vscode from 'vscode';

const steps = [
    {
        placeholder: "Select a task",
        items: [
            {
                label: 'A',
            },
            {
                label: 'B',
            }
        ],
    },
    {
        placeholder: "Select a status",
        items: [
            {
                label: 'S1',
            },
            {
                label: 'S2',
            },
        ],
    }
];

type step = {
    placeholder: string,
    items: [
        {
            label: string
        }
    ]
};

export const confirmButton: vscode.QuickInputButton = {
    iconPath: new vscode.ThemeIcon('arrow-right'),
    tooltip: 'confirm',
};

var stepCounter = 0;
export async function showQuickPick(step: any = 0) {
    while (stepCounter < steps.length) {
        console.log('stepCounter', stepCounter);
        var currentStep = <step>steps[stepCounter];
        console.log('currentStep', currentStep);
        await createQuickPick(stepCounter + 1, currentStep.items, currentStep.placeholder)
            .then((response) => {
                console.log('then response', response);
                stepCounter++;
            })
            .catch((response) => {
                console.log('catch response', response);
                stepCounter--;
            });
    }
    stepCounter = 0;

}

async function createQuickPick(step: any, items: any, placeholder: string) {
    return new Promise(function (resolve, reject) {
        const picker = vscode.window.createQuickPick();
        picker.placeholder = placeholder;
        picker.matchOnDescription = true;
        picker.matchOnDetail = true;
        picker.ignoreFocusOut = true;
        picker.items = items;
        picker.step = step;
        picker.totalSteps = steps.length;
        picker.show();
        picker.buttons = [vscode.QuickInputButtons.Back, confirmButton];

        picker.onDidAccept(function () {
            console.log('onDidAccept', picker.activeItems);
            if (picker.activeItems.length) {
                picker.dispose();
                resolve({
                    value: picker.value,
                    activeItems: picker.activeItems,
                });
            }
        });
        picker.onDidTriggerButton(function (e) {
            if (e === confirmButton) {
                if (picker.activeItems.length) {
                    resolve({
                        value: picker.value,
                        activeItems: picker.activeItems,
                    });
                } else {
                    resolve({
                        value: picker.value,
                        activeItems: [picker.items[0]],
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