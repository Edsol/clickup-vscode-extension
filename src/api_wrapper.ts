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

    async addTeam(name: string) {
        const { body } = await this.clickup.teams.create();
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

    async deleteSpace(spaceId: string) {
        const { body } = await this.clickup.spaces.delete(spaceId);
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
        var { body } = await this.clickup.lists.createTask(listId, data);
        return body;
    }

    async deleteTask(taskId: string) {
        var { body } = await this.clickup.tasks.delete(taskId);
        return body;
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
                console.log('remove ' + tag.name + 'from task ' + taskId);
                this.clickup.tasks.removeTag(taskId, tag.name);
            });
            return;
        }

        Object.values(previousTags).map((tag: any) => {
            if (Object.values(tags).includes(tag.name) === false) {
                console.log('remove tag ' + tag.name + 'from task ' + taskId);
                this.clickup.tasks.removeTag(taskId, tag.name);
            }
        });

        tags.forEach((tagName: string) => {
            var tagFound = previousTags.filter((obj: any) => obj.name === tagName);
            if (tagFound.length === 0) {
                console.log('add tag ' + tagName + 'in task ' + taskId);
                this.clickup.tasks.addTag(taskId, tagName);
            }
        });
    }
}