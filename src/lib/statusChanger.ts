import * as vscode from 'vscode';
import { createQuickPick } from './statusQuickPicks';


export class StatusChanger {
    apiWrapper;

    itemsList: { [K: string]: any } = {
        team: {
            params: {
                type: 'team',
                prevType: null,
                nextType: 'space',
                placeholder: "Select a Team",
            },
            id: undefined,
            items: async () => this.reduce(await this.apiWrapper.getTeams())
        },
        space: {
            params: {
                type: 'space',
                prevType: 'team',
                nextType: 'folder',
                placeholder: "Select a space",
            },
            id: undefined,
            items: async (teamId: string) => this.reduce(await this.apiWrapper.getSpaces(teamId))
        },
        folder: {
            params: {
                type: 'folder',
                prevType: 'space',
                nextType: 'list',
                placeholder: "Select a folder",
            },
            id: undefined,
            items: async (spaceId: string) => this.reduce(await this.apiWrapper.getFolders(spaceId))
        },
        list: {
            params: {
                type: 'list',
                prevType: 'folder',
                nextType: 'task',
                placeholder: "Select a list",
            },
            id: undefined,
            items: async (folderId: string) => this.reduce(await this.apiWrapper.getLists(folderId))
        },
        task: {
            params: {
                type: 'task',
                prevType: 'list',
                nextType: null,
                placeholder: "Select a task",
            },
            id: undefined,
            items: async (listId: string) => this.reduce(await this.apiWrapper.getTasks(listId))
        },
    };

    constructor(apiWrapper: any) {
        this.apiWrapper = apiWrapper;
    }
    /**
     *
     *
     * @param {string} [type='teams']
     * @param {string} [id='']
     * @return {*} 
     * @memberof StatusChanger
     */
    async showTaskChooserQuickPick(type: string = 'team', id: string | undefined = undefined) {
        while (this.itemsList.task.id === undefined) {
            var currentStep = await this.itemsList[type];
            var items = await currentStep.items(id);

            await createQuickPick(items, currentStep.params.placeholder, 1)
                .then((response: any) => {
                    if (currentStep.params.type === 'task') {
                        this.itemsList.task.id = response.id;
                        this.itemsList.task.label = response.label;
                        return;
                    }
                    this.itemsList[type].id = id = response.id;
                    type = currentStep.params.nextType;
                })
                .catch((error) => {
                    // restore previous type and key to go back
                    var prevStep = this.itemsList[currentStep.params.prevType];
                    if (!prevStep) {
                        return;
                    }
                    type = prevStep.params.type;
                    id = undefined;
                    if (prevStep.params.prevType) {
                        id = this.itemsList[prevStep.params.prevType].id;
                    }
                });
        }
        return this.itemsList.task;
    }

    async showStatusQuickPick(listId: number | string) {
        const statuses = await this.apiWrapper.getStatus(listId);
        const items = statuses.map((e: any) => {
            return {
                picked: e.type === 'closed',
                label: e.status
            };
        });
        // const activeItems = statuses.filter((e: any) => e.type === 'closed').map((e: any) => { return { label: e.status }; });
        const placeHolder = "Select a status to assign";
        return await createQuickPick(items, placeHolder, 1)
            .then((response: any) => {
                return response.label;
            })
            .catch(() => {
                return undefined;
            });
    }

    async removeTaskQuickPick() {
        const items = [
            {
                label: "Yes",
                value: 1
            },
            {
                label: "No",
                value: 0
            },
        ];

        const placeHolder = "Forget the task?";
        return await createQuickPick(items, placeHolder, 1)
            .then((response: any) => {
                return response.value;
            })
            .catch(() => {
                return undefined;
            });
    }
    /**
     *
     *
     * @private
     * @param {*} obj
     * @return {*} 
     * @memberof StatusChanger
     */
    private reduce(obj: any) {
        var response: any[] = [];
        Object.values(obj).forEach((element: any) => {
            response.push({
                id: element.id,
                label: element.name
            });
        });
        return response;
    }
    /**
     * set git commit text
     *
     * @param {string} text
     * @memberof StatusChanger
     */
    public setGitMessage(text: string) {
        const vscodeGit = vscode.extensions.getExtension('vscode.git')?.exports;
        let api = vscodeGit.getAPI(1);
        api.repositories[0].inputBox.value = text;
    }
}