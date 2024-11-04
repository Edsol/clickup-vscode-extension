const clickup = require('clickup.js');
const buildSearchParams = require('clickup.js/src/utils/buildSearchParams');

import { Task, Member, Statuses, Tag, Team, Tracking, CreateTime, Time } from '../types';

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
    async getFolderlessLists(spaceId: string) {
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
    async updateTask(taskId: string, data: unknown): Promise<unknown> {
        const { body } = await this.clickup.tasks.update(taskId, data);
        return body;
    }

    /**
     *
     *
     * @param {string} taskId
     * @param {Array<Tag>} previousTags
     * @param {Array<string>} tags
     * @return {*} 
     * @memberof ApiWrapper
     */
    //TODO: refactoring function
    async updateTaskTags(taskId: string, previousTags: Array<Tag>, tags: Array<string>) {
        if (tags === undefined) {
            //remove all tags
            Object.values(previousTags).map((tag: Tag) => {
                this.clickup.tasks.removeTag(taskId, tag.name);
            });
            return;
        }

        Object.values(previousTags).map((tag: Tag) => {
            if (tag.name in tags) {
                this.clickup.tasks.removeTag(taskId, tag.name);
            }
            // if (Object.values(tags).includes(tag.name) === false) {
            //     this.clickup.tasks.removeTag(taskId, tag.name);
            // }
        });

        for (const tagName of tags) {
            const tagFound = previousTags.filter((obj: Tag) => obj.name === tagName);
            if (tagFound.length === 0) {
                this.clickup.tasks.addTag(taskId, tagName);
            }
        }
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
}