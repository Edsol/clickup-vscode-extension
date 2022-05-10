
const vscode = acquireVsCodeApi();

var tagifyAssignTo;
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
        var assignToElement = document.getElementById("assignTo");
        var statusesElement = document.getElementById("status");
        var tagsElement = document.getElementById("tags");
        var priorityElement = document.getElementById("priority");

        tagifyAssignTo = new Tagify(assignToElement, tagifyOptions);
        tagifyStatuses = new Tagify(statusesElement, tagifySelectOptions);
        tagifyTags = new Tagify(tagsElement, tagifyOptions);
        tagifyPriorities = new Tagify(priorityElement, tagifySelectOptions);

        window.addEventListener("message", (event) => {
            const message = event.data;

            switch (message.command) {
                case "init":
                    this.task = message.data.task;
                    this.taskCopy = JSON.parse(JSON.stringify(this.task));
                    console.log(this.taskCopy);
                    this.members = message.data.members;
                    tagifyAssignTo.whitelist = message.data.members;
                    tagifyAssignTo.addTags(message.data.members);

                    this.statuses = message.data.statuses;
                    tagifyStatuses.whitelist = message.data.statuses;
                    tagifyStatuses.addTags(message.data.task.status.status);

                    this.tags = message.data.tags;
                    tagifyTags.whitelist = message.data.tags;

                    //TODO: refactoring
                    message.data.task.tags.forEach((tag) => {
                        tagifyTags.addTags(tag.name);
                    });
                    // tagifyTags.addTags(message.data.task.tags);

                    this.priorities = message.data.priorities;
                    tagifyPriorities.whitelist = message.data.priorities;
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