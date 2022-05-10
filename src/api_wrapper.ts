var clickup = require('clickup.js');
import { Task, Member, Status, Statuses, Tag, Priority, Space } from './types';

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

    // async getTeamId() {
    //     var teams = await this.getTeams();
    //     return teams[0].id;
    // }


    async getSpaces() {
        var teams = await this.getTeams();
        var teamId = teams[0].id;
        const { body } = await this.clickup.teams.getSpaces(teamId);
        return body.spaces;
    }

    async getFolderlessLists(spaceId: String) {
        const { body } = await this.clickup.spaces.getFolderlessLists(spaceId);

        return body.lists;
    }

    async getLists() {
        var spaces = await this.getSpaces();
        return await this.getFolderlessLists(spaces[0].id);
    }

    async getAllTasks() {
        var lists = await this.getLists();
        var { body } = await this.clickup.lists.getTasks(lists[0].id);
        var tasks: Array<Task> = body.tasks;
        return tasks;
    }

    async extractStatus(tasks: any) {
        tasks.map((task: any) => {
            console.log(task);
        });
    }

    async getMembers() {
        var lists = await this.getLists();
        var { body } = await this.clickup.lists.getMembers(lists[0].id);
        var members: Array<Member> = body.members;
        return members;
    }

    async getStatus() {
        var lists = await this.getLists();
        var { body } = await this.clickup.lists.get(lists[0].id);
        var status: Array<Statuses> = body.statuses;
        return status;
    }

    async getTags() {
        var spaces = await this.getSpaces();
        var { body } = await this.clickup.spaces.getTags(spaces[0].id);
        var tags: Array<Tag> = body.tags;
        return tags;
    }

    async getPriorities() {
        var spaces: Array<Space> = await this.getSpaces();
        var priorities: Array<Priority> = spaces[0].features.priorities.priorities;
        return priorities;
    }



    async newTask(data: any) {
        var lists = await this.getLists();
        var { body } = await this.clickup.spaces.getTags(lists[0].id, data);
        return body;
    }

    /**
     * @param taskId {string}
     * @param data {Object}
     * 
     * @returns object
     */
    async updateTask(taskId: string, data: Object): Promise<any> {
        console.log('updateTask data', data);
        var { body } = await this.clickup.tasks.update(taskId, data);
        return body;
    }
}