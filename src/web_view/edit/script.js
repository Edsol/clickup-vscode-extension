
const vscode = acquireVsCodeApi();

var tagifyAssignees;
var tagifyStatuses;
var tagifyTags;
var tagifyPriorities;

var taskCopy;

const tagifyOptions = {
    enforceWhitelist: true,
    userInput: false,
    dropdown: {
        maxItems: 10,
        enabled: 0,
        closeOnSelect: false
    }
};

const tagifySelectOptions = {
    enforceWhitelist: true,
    userInput: false,
    mode: "select",
    dropdown: {
        maxItems: 10,
        enabled: 0,
        closeOnSelect: true
    }
};

const appData = {
    data() {
        return {
            task: {
                id: null,
                url: '#',
                description: null,
                name: null
            },
            members: [],
            selectedMember: "",
        };
    },
    mounted() {
        var assigneesElement = document.getElementById("assignees");
        var statusesElement = document.getElementById("status");
        var tagsElement = document.getElementById("tags");
        var priorityElement = document.getElementById("priority");

        tagifyAssignees = new Tagify(assigneesElement, tagifyOptions);
        tagifyStatuses = new Tagify(statusesElement, tagifySelectOptions);
        tagifyTags = new Tagify(tagsElement, tagifyOptions);
        tagifyPriorities = new Tagify(priorityElement, tagifySelectOptions);

        window.addEventListener("message", (event) => {
            const message = event.data;

            switch (message.command) {
                case "init":
                    this.task = message.data.task;
                    this.taskCopy = JSON.parse(JSON.stringify(this.task));

                    tagifyAssignees.whitelist = this.members = message.data.members;
                    tagifyAssignees.addTags(message.data.members);

                    tagifyStatuses.whitelist = this.statuses = message.data.statuses;
                    tagifyStatuses.addTags(message.data.task.status.status);

                    this.tags = message.data.tags;
                    tagifyTags.whitelist = message.data.tags;

                    //TODO: refactoring
                    message.data.task.tags.forEach((tag) => {
                        tagifyTags.addTags(tag.name);
                    });
                    // tagifyTags.addTags(message.data.task.tags);

                    tagifyPriorities.whitelist = this.priorities = message.data.priorities;
                    tagifyPriorities.addTags(message.data.task.priority.priority);
                    break;
            }
        });
    },
    methods: {
        onChange(e) {
            var key = e.currentTarget.id;
            var value = e.currentTarget.value;
            switch (key) {
                case 'status':
                case 'priority':
                    var data = JSON.parse(value);
                    this.task[key] = data[0];
                    break;

                default:
                    this.task[key] = JSON.parse(value);
                    break;
            }
        },
        save: function (e) {
            if (!this.task.name === '') {
                this.sendMessageToBackend("error", "Title is required.");
            } else {
                //TODO: cloned object because can't send it directly,I fix it after
                this.sendMessageToBackend("updateTask", JSON.parse(JSON.stringify(this.task)));
            }
        },
        sendMessageToBackend(command = null, args = null) {
            vscode.postMessage({
                command: command,
                args: args
            });
        },
    }
};


Vue.createApp(appData).mount("#app");