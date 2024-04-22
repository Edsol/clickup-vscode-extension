const clickup = require('clickup.js');
const buildSearchParams = require('clickup.js/src/utils/buildSearchParams');

import { Task, Member, Statuses, Tag, Team } from '../types';

export class ApiWrapper {
    clickup: typeof clickup;
    token: string;

    constructor(token: string) {
        this.token = token;
        this.clickup = new clickup.Clickup(token);
    }

    async getUser() {
        const { body } = await this.clickup.authorization.getAuthorizedUser();
        return body.user;
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
        const { body } = await this.clickup.lists.getTasks(listId);
        const tasks: Array<Task> = body.tasks;
        return tasks;
    }

    async getMembers(listId: string) {
        const { body } = await this.clickup.lists.getMembers(listId);
        const members: Array<Member> = body.members;
        return members;
    }

    async getStatus(listId: string) {
        const { body } = await this.clickup.lists.get(listId);
        const status: Array<Statuses> = body.statuses;
        return status;
    }

    async getTags(spaceId: string) {
        const { body } = await this.clickup.spaces.getTags(spaceId);
        const tags: Array<Tag> = body.tags;
        return tags;
    }

    async getPriorities(spaceId: string) {
        const space = await this.getSpace(spaceId);
        return space.features.priorities.priorities;
    }

    async newTask(listId: string, data: unknown) {
        const { body } = await this.clickup.lists.createTask(listId, data);
        return body;
    }

    async deleteTask(taskId: string) {
        const { body } = await this.clickup.tasks.delete(taskId);
        return body;
    }

    async getTrackedTime(taskId: string) {
        const { body } = await this.clickup.tasks.getTrackedTime(taskId);
        return body.data;
    }

    async getTimeInStatus(taskId: string) {
        const { body } = await this.clickup.tasks.getTimeInStatus(taskId);
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

    async countTasks(listId: string) {
        const tasks = await this.getTasks(listId);
        return tasks.length === undefined ? 0 : tasks.length;
    }

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