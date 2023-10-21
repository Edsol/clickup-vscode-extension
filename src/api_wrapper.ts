var clickup = require('clickup.js');
import { Task, Member, Statuses, Tag, Team } from './types';

export class ApiWrapper {
    clickup: typeof clickup;
    token: any;

    constructor(token: String) {
        this.token = token;
        this.clickup = new clickup.Clickup(token);
    }

    async getTeams() {
        const { body } = await this.clickup.teams.get();
        return <[Team]>body.teams;
    }

    async createTeam(name: string) {
        const { body } = await this.clickup.teams.create(name);
        return body;
    }

    async getSpaces(teamId: string) {
        const { body } = await this.clickup.teams.getSpaces(teamId);
        return body.spaces;
    }

    async getSpace(spaceId: string) {
        const { body } = await this.clickup.spaces.get(spaceId);
        return body;
    }
    async getFolders(spaceId: string) {
        const { body } = await this.clickup.spaces.getFolders(spaceId);
        return body.folders;
    }

    async createSpace(teamId: string, name: string) {
        const { body } = await this.clickup.teams.createSpace(teamId, {
            name: name
        });
        return body;
    }

    async deleteSpace(spaceId: string) {
        const { body } = await this.clickup.spaces.delete(spaceId);
        return body;
    }

    async createList(spaceId: string, name: string) {
        const { body } = await this.clickup.spaces.createFolderlessList(spaceId, {
            name: name
        });
        return body;
    }

    async deleteList(listId: string) {
        const { body } = await this.clickup.lists.delete(listId);
        return body;
    }

    async getFolderLists(spaceId: string) {
        const { body } = await this.clickup.spaces.getFolderlessLists(spaceId);
        return body.lists;
    }
    async getLists(folderId: string) {
        const { body } = await this.clickup.folders.getLists(folderId);
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
        var { body } = await this.clickup.lists.createTask(listId, data);
        return body;
    }

    async deleteTask(taskId: string) {
        var { body } = await this.clickup.tasks.delete(taskId);
        return body;
    }

    async getTrackedTime(taskId: string) {
        var { body } = await this.clickup.tasks.getTrackedTime(taskId);
        return body.data;
    }

    async getTimeInStatus(taskId: string) {
        var { body } = await this.clickup.tasks.getTimeInStatus(taskId);
        return body.data;
    }

    /**
 * @param taskId {string}
 * @param data {Object}
 * 
 * @returns object
 */
    async updateTask(taskId: string, data: any): Promise<any> {
        var { body } = await this.clickup.tasks.update(taskId, data);
        return body;
    }

    //TODO: refactoring function
    async updateTaskTags(taskId: string, previousTags: any, tags: any) {
        if (tags === undefined) {
            //remove all tags
            Object.values(previousTags).map((tag: any) => {
                this.clickup.tasks.removeTag(taskId, tag.name);
            });
            return;
        }

        Object.values(previousTags).map((tag: any) => {
            if (Object.values(tags).includes(tag.name) === false) {
                this.clickup.tasks.removeTag(taskId, tag.name);
            }
        });

        tags.forEach((tagName: string) => {
            var tagFound = previousTags.filter((obj: any) => obj.name === tagName);
            if (tagFound.length === 0) {
                this.clickup.tasks.addTag(taskId, tagName);
            }
        });
    }

    async countTasks(listId: string) {
        var tasks = await this.getTasks(listId);
        return tasks.length === undefined ? 0 : tasks.length;
    }
}