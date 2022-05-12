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








    // async getTeamId() {
    //     var teams = await this.getTeams();
    //     return teams[0].id;
    // }




    // async getFolderlessLists(spaceId: String) {
    //     const { body } = await this.clickup.spaces.getFolderlessLists(spaceId);

    //     return body.lists;
    // }



    // async getAllTasks() {
    //     var lists = await this.getLists();
    //     var { body } = await this.clickup.lists.getTasks(lists[0].id);
    //     var tasks: Array<Task> = body.tasks;
    //     return tasks;
    // }

    // async extractStatus(tasks: any) {
    //     tasks.map((task: any) => {
    //         console.log(task);
    //     });
    // }







    async newTask(data: any) {
        // var lists = await this.getLists();
        // var { body } = await this.clickup.spaces.getTags(lists[0].id, data);
        // return body;
        return {
            'id': 1
        };
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