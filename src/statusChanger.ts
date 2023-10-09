import * as vscode from 'vscode'
import { createQuickPick } from './lib/statusQuickPicks';

var taskId: any = null;

export class StatusChanger {
    apiWrapper;

    fetchApi: { [K: string]: Function } = {
        teams: async () => {
            return {
                type: 'teams',
                prevType: null,
                nextType: 'spaces',
                placeholder: "Choose a Team",
                items: this.reduce(await this.apiWrapper.getTeams())
            };
        },
        spaces: async (teamId: string) => {
            return {
                type: 'spaces',
                prevType: 'teams',
                nextType: 'folders',
                placeholder: "Choose a space",
                items: this.reduce(await this.apiWrapper.getSpaces(teamId))
            };
        },
        folders: async (spaceId: string) => {
            return {
                type: 'folders',
                prevType: 'spaces',
                nextType: 'lists',
                placeholder: "Choose a space",
                items: this.reduce(await this.apiWrapper.getFolders(spaceId))
            };
        },
        lists: async (folderId: string) => {
            return {
                type: 'lists',
                prevType: 'folders',
                nextType: 'tasks',
                placeholder: "Choose a space",
                items: this.reduce(await this.apiWrapper.getLists(folderId))
            };
        },
        tasks: async (listId: string) => {
            return {
                type: 'tasks',
                prevType: 'lists',
                nextType: null,
                placeholder: "Choose a space",
                items: this.reduce(await this.apiWrapper.getTasks(listId))
            };
        },
    };

    private lastId: { [K: string]: string } = {
        teams: '',
        spaces: '',
        folders: '',
        lists: '',
        tasks: '',
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
    async showTaskChooserQuickPick(type: string = 'teams', id: string = '') {
        while (taskId === null) {
            var currentStep = await this.fetchApi[type](id);

            await createQuickPick(currentStep.items, currentStep.placeholder, 1)
                .then((response: any) => {
                    if (currentStep.nextType) {
                        type = currentStep.nextType;
                        id = this.lastId[type] = response.id;
                    } else {
                        taskId = response.id;
                    }
                })
                .catch(() => {
                    // restore previous type and key to go back
                    type = currentStep.prevType;
                    id = this.lastId[type];
                });
        }

        return {
            taskId: taskId,
            listId: this.lastId['lists']
        };
    }

    async showStatusQuickPick(listId: string) {
        console.log('statuses', listId);
        const statuses = await this.apiWrapper.getStatus(listId);
        // var items = [];
        // const placeHolder = "";
        // await createQuickPick(items, placeHolder, 1)
        //     .then((response: any) => {
        //         console.log('response', response);
        //     })
        //     .catch(() => {
        //     });
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