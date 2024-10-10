const clickup = require('clickup.js');
const buildSearchParams = require('clickup.js/src/utils/buildSearchParams');

import { Task, Member, Statuses, Tag, Team, Tracking, CreateTime, Time, Assignee, TaskUpdate, AssigneesUpdate } from '../types';

export class ApiWrapper {
    clickup: typeof clickup;
    token: string;

    constructor(token: string) {
        this.token = token;
        this.clickup = new clickup.Clickup(token);
    }

    /**
     *
     *
     * @return {*} 
     * @memberof ApiWrapper
     */
    async getUser() {
        const { body } = await this.clickup.authorization.getAuthorizedUser();
        return body.user;
    }

    /**
     *
     *
     * @return {*} 
     * @memberof ApiWrapper
     */
    async getTeams() {
        const { body } = await this.clickup.teams.get();
        return <[Team]>body.teams;
    }

    /**
     *
     *
     * @param {string} name
     * @return {*} 
     * @memberof ApiWrapper
     */
    async createTeam(name: string) {
        const { body } = await this.clickup.teams.create(name);
        return body;
    }

    /**
     *
     *
     * @param {string} teamId
     * @return {*} 
     * @memberof ApiWrapper
     */
    async getSpaces(teamId: string) {
        const { body } = await this.clickup.teams.getSpaces(teamId);
        return body.spaces;
    }

    /**
     *
     *
     * @param {string} spaceId
     * @return {*} 
     * @memberof ApiWrapper
     */
    async getSpace(spaceId: string) {
        const { body } = await this.clickup.spaces.get(spaceId);
        return body;
    }
    /**
     *
     *
     * @param {string} spaceId
     * @return {*} 
     * @memberof ApiWrapper
     */
    async getFolders(spaceId: string) {
        const { body } = await this.clickup.spaces.getFolders(spaceId);
        return body.folders;
    }

    /**
     *
     *
     * @param {string} teamId
     * @param {string} name
     * @return {*} 
     * @memberof ApiWrapper
     */
    async createSpace(teamId: string, name: string) {
        const { body } = await this.clickup.teams.createSpace(teamId, {
            name: name
        });
        return body;
    }

    /**
     *
     *
     * @param {string} spaceId
     * @return {*} 
     * @memberof ApiWrapper
     */
    async deleteSpace(spaceId: string) {
        const { body } = await this.clickup.spaces.delete(spaceId);
        return body;
    }

    /**
     *
     *
     * @param {string} spaceId
     * @param {string} name
     * @return {*} 
     * @memberof ApiWrapper
     */
    async createList(spaceId: string, name: string) {
        const { body } = await this.clickup.spaces.createFolderlessList(spaceId, {
            name: name
        });
        return body;
    }

    /**
     *
     *
     * @param {string} listId
     * @return {*} 
     * @memberof ApiWrapper
     */
    async deleteList(listId: string) {
        const { body } = await this.clickup.lists.delete(listId);
        return body;
    }

    /**
     *
     *
     * @param {string} spaceId
     * @return {*} 
     * @memberof ApiWrapper
     */
    async getFolderLists(spaceId: string) {
        const { body } = await this.clickup.spaces.getFolderlessLists(spaceId);
        return body.lists;
    }
    /**
     *
     *
     * @param {string} folderId
     * @return {*} 
     * @memberof ApiWrapper
     */
    async getLists(folderId: string) {
        const { body } = await this.clickup.folders.getLists(folderId);
        return body.lists;
    }

    /**
     * Get a task
     *
     * @param {string} taskId
     * @return {*}  {Promise<Task>}
     * @memberof ApiWrapper
     */
    async getTask(taskId: string): Promise<Task> {
        const { body } = await this.clickup.tasks.get(taskId);
        return body;
    }

    /**
     *
     *
     * @param {string} listId
     * @return {*} 
     * @memberof ApiWrapper
     */
    async getTasks(listId: string) {
        const { body } = await this.clickup.lists.getTasks(listId);
        const tasks: Array<Task> = body.tasks;
        return tasks;
    }

    /**
     *
     *
     * @param {string} listId
     * @return {*} 
     * @memberof ApiWrapper
     */
    async getMembers(listId: string) {
        const { body } = await this.clickup.lists.getMembers(listId);
        const members: Array<Member> = body.members;
        return members;
    }

    /**
     *
     *
     * @param {string} listId
     * @return {*} 
     * @memberof ApiWrapper
     */
    async getStatus(listId: string) {
        const { body } = await this.clickup.lists.get(listId);
        const status: Array<Statuses> = body.statuses;
        return status;
    }

    /**
     *
     *
     * @param {string} spaceId
     * @return {*} 
     * @memberof ApiWrapper
     */
    async getTags(spaceId: string) {
        const { body } = await this.clickup.spaces.getTags(spaceId);
        const tags: Array<Tag> = body.tags;
        return tags;
    }

    /**
     *
     *
     * @param {string} spaceId
     * @return {*} 
     * @memberof ApiWrapper
     */
    async getPriorities(spaceId: string) {
        const space = await this.getSpace(spaceId);
        return space.features.priorities.priorities;
    }

    /**
     *
     *
     * @param {string} listId
     * @param {unknown} data
     * @return {*} 
     * @memberof ApiWrapper
     */
    async newTask(listId: string, data: unknown) {
        const { body } = await this.clickup.lists.createTask(listId, data);
        return body;
    }
    /**
     *
     *
     * @param {string} taskId
     * @return {*} 
     * @memberof ApiWrapper
     */
    async deleteTask(taskId: string) {
        const { body } = await this.clickup.tasks.delete(taskId);
        return body;
    }

    // endpoint calls for times

    /**
     * Get tracked time for a task
     *
     * @param {string} taskId
     * @return {*}  {Promise<Array<Tracking>>}
     * @memberof ApiWrapper
     */
    async getTrackedTime(taskId: string): Promise<Array<Tracking>> {
        const { body } = await this.clickup.tasks.getTrackedTime(taskId);
        return body.data;
    }
    /**
     *
     *
     * @param {string} taskId
     * @return {*} 
     * @memberof ApiWrapper
     */
    async getTimeInStatus(taskId: string) {
        const { body } = await this.clickup.tasks.getTimeInStatus(taskId);
        return body.data;
    }

    async getTimeEntries(teamId: string, options = {}): Promise<Array<Time>> {
        const { body } = await this.clickup.teams.getTimeEntries(teamId, options);
        return body.data;
    }

    /**
     * Start a timer for the authenticated user.
     *
     * @param {string} teamId
     * @param {CreateTime} [data]
     * @return {*}  {Promise<Time>}
     * @memberof ApiWrapper
     */
    async startTime(teamId: string, data?: CreateTime): Promise<Time> {
        const { body } = await this.clickup.teams.startTimeEntry(teamId, data);
        return body.data;
    }
    /**
     * Stop a timer that's currently running for the authenticated user.
     *
     * @param {string} teamId
     * @return {*}  {Promise<CreateTime>}
     * @memberof ApiWrapper
     */
    async stopTime(teamId: string): Promise<Time> {
        const { body } = await this.clickup.teams.stopTimeEntry(teamId);
        return body.data;
    }

    async getRunningTime(teamId: string, userId?: string): Promise<Time> {
        const { body } = await this.clickup.teams.getRunningTimeEntry(teamId);
        return body.data;
    }

    /**
     * @param taskId {string}
     * @param data {Object}
     * 
     * @returns object
     */
    async updateTask(task: Task, data: any): Promise<Task | undefined> {
        let taskUpdate = this.mapTaskToTaskUpdate(data);
        if (data.assignees) {
            taskUpdate.assignees = await this.parseAssignees(task.assignees, data.assignees);
        }

        const { body } = await this.clickup.tasks.update(task.id, taskUpdate);
        if (data.tags) {
            await this.updateTaskTags(task.id, task.tags, data.tags);
        }

        return body;
    }

    /* eslint-disable @typescript-eslint/naming-convention */
    private mapTaskToTaskUpdate(task: Task): TaskUpdate {
        const fieldsToMap: Partial<TaskUpdate> = {
            name: task.name,
            description: task.description,
            status: task.status?.id,
            priority: task.priority?.id,
            due_date: task.dueDate ? new Date(task.dueDate).getTime() : undefined,
            start_date: task.startDate ? new Date(task.startDate).getTime() : undefined,
            archived: task.archived,
        };

        const taskUpdate = Object.entries(fieldsToMap).reduce((acc, [key, value]) => {
            if (value !== null && value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {} as TaskUpdate);

        return taskUpdate;
    }
    /* eslint-enable @typescript-eslint/naming-convention */

    /**
     *
     *
     * @param {string} taskId
     * @param {Array<Tag>} previousTags
     * @param {Array<string>} tags
     * @return {*} 
     * @memberof ApiWrapper
     */
    async updateTaskTags(taskId: string, previousTags: Array<Tag>, tags?: Array<string | Tag>) {
        if (!tags || tags.length === 0) {
            // remove all tags
            for (const tag of previousTags) {
                await this.clickup.tasks.removeTag(taskId, tag.name);
            }
            return;
        }

        const newTagNames = tags.map(tag => typeof tag === 'string' ? tag : tag.name);

        for (const tag of previousTags) {
            if (!newTagNames.includes(tag.name)) {
                await this.clickup.tasks.removeTag(taskId, tag.name);
            }
        }

        for (const tagName of newTagNames) {
            const tagExists = previousTags.some(tag => tag.name === tagName);
            if (!tagExists) {
                await this.clickup.tasks.addTag(taskId, tagName);
            }
        }
    }
    /**
     *
     *
     * @param {Assignee[]} previousAssignees
     * @param {Assignee[]} [newAssignees]
     * @return {*} 
     * @memberof ApiWrapper
     */
    async parseAssignees(previousAssignees: Assignee[], newAssignees?: number[]): Promise<AssigneesUpdate> {
        // Se `newAssignees` è undefined o un array vuoto, rimuovi tutti gli assegnatari
        if (!newAssignees || newAssignees.length === 0) {
            return {
                add: [],
                rem: previousAssignees.map(assignee => assignee.id), // Rimuovi tutti gli assegnatari precedenti
            };
        }

        // Ottieni gli ID degli assegnatari precedenti
        const previousAssigneeIds = previousAssignees.map(assignee => assignee.id);

        // Crea Set per una verifica rapida degli ID
        const newAssigneeSet = new Set(newAssignees);
        const previousAssigneeSet = new Set(previousAssigneeIds);

        // Trova gli ID degli assegnatari da aggiungere (presenti in `newAssignees` ma non in `previousAssigneeSet`)
        const add = newAssignees.filter(id => !previousAssigneeSet.has(id));

        // Trova gli ID degli assegnatari da rimuovere (presenti in `previousAssigneeIds` ma non in `newAssigneeSet`)
        const rem = previousAssigneeIds.filter(id => !newAssigneeSet.has(id));

        return { add, rem };
    }

    /**
     *
     *
     * @param {string} listId
     * @return {*} 
     * @memberof ApiWrapper
     */
    async countTasks(listId: string) {
        const tasks = await this.getTasks(listId);
        return tasks.length === undefined ? 0 : tasks.length;
    }
    /**
     *
     *
     * @param {string} teamId
     * @param {string} assignId
     * @return {*} 
     * @memberof ApiWrapper
     */
    /* eslint-disable @typescript-eslint/naming-convention */
    async getMyTask(teamId: string, assignId: string) {
        const options = {
            "assignees[]": [
                // assignees: TODO: waiting to accept the PR to fix
                assignId
            ]
        };

        const { body } = await this.clickup.teams.getFilteredTasks(teamId, options);
        return body.tasks;
    }
    /* eslint-enable @typescript-eslint/naming-convention */
}