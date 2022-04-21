var clickup = require('clickup.js');
import { Task, Member } from './types';

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

    async getAllTasks() {
        var spaces = await this.getSpaces();
        var lists = await this.getFolderlessLists(spaces[0].id);
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
        var spaces = await this.getSpaces();
        var lists = await this.getFolderlessLists(spaces[0].id);
        var { body } = await this.clickup.lists.getMembers(lists[0].id);
        var members: Array<Member> = body.members;
        return members;
    }
}