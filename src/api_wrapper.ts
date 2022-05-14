var clickup = require('clickup.js');
import { Task, Member, Statuses, Tag } from './types';

export class ApiWrapper {
    clickup: typeof clickup;
    token: any;

    constructor(token: String) {
        this.token = token;
        this.clickup = new clickup.Clickup(token);
    }

    async getTeams() {
        const { body } = await this.clickup.teams.get();
        return body.teams;
    }

    async getSpaces(teamId: string) {
        const { body } = await this.clickup.teams.getSpaces(teamId);
        return body.spaces;
    }

    async getSpace(spaceId: string) {
        const { body } = await this.clickup.spaces.get(spaceId);
        return body;
    }

    async getFolderLists(spaceId: string) {
        const { body } = await this.clickup.spaces.getFolderlessLists(spaceId);
        return body.lists;
    }

    async getTasks(listId: string) {
        var { body } = await this.clickup.lists.getTasks(listId);
        var tasks: Array<Task> = body.tasks;
        return tasks;
    }


    async getMembers(listId: string) {
        var { body } = await this.clickup.lists.getMembers(listId);
        var members: Array<Member> = body.members;
        return members;
    }

    async getStatus(listId: string) {
        var { body } = await this.clickup.lists.get(listId);
        var status: Array<Statuses> = body.statuses;
        return status;
    }

    async getTags(spaceId: string) {
        var { body } = await this.clickup.spaces.getTags(spaceId);
        var tags: Array<Tag> = body.tags;
        return tags;
    }

    async getPriorities(spaceId: string) {
        var space = await this.getSpace(spaceId);
        return space.features.priorities.priorities;
    }

    async newTask(listId: string, data: any) {
        console.log('newTask', listId, data);
        var { body } = await this.clickup.lists.createTask(listId, data);
        console.log('newTask response', body);
        return body;
    }

    /**
     * @param taskId {string}
     * @param data {Object}
     * 
     * @returns object
     */
    async updateTask(taskId: string, data: Object): Promise<any> {
        var { body } = await this.clickup.tasks.update(taskId, data);
        return body;
    }
}