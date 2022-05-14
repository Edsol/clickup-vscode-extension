const vscode = acquireVsCodeApi();

var tagifyAssignTo;
var tagifyStatuses;
var tagifyTags;
var tagifyPriorities;

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

Vue.createApp({
    data() {
        return {
            task: {
                description: null,
                name: null
            },
            list: {
                id: null
            },
            members: [],
            selectedMember: "",
        };
    },
    mounted() {
        var assignToElement = document.getElementById("assignes");
        var statusesElement = document.getElementById("status");
        var tagsElement = document.getElementById("tags");
        var priorityElement = document.getElementById("priority");

        tagifyAssignTo = new Tagify(assignToElement, tagifyOptions);
        tagifyStatuses = new Tagify(statusesElement, tagifySelectOptions);
        tagifyTags = new Tagify(tagsElement, tagifyOptions);
        tagifyPriorities = new Tagify(priorityElement, tagifySelectOptions);

        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case "init":
                    this.list = message.data.list;
                    tagifyAssignTo.whitelist = this.members = message.data.members;
                    tagifyStatuses.whitelist = this.statuses = message.data.statuses;
                    tagifyTags.whitelist = this.tags = message.data.tags;
                    tagifyPriorities.whitelist = this.priorities = message.data.priorities;
                    break;
            }
        });
    },
    methods: {
        onChange(e) {
            var key = e.currentTarget.id;
            var value = e.currentTarget.value;
            console.log('onChange', key, value);
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
        checkForm: function (e) {
            if (!this.task.name) {
                this.sendMessageToBackend('error', 'Title is required.');
            } else {
                console.log('send task data', this.task);
                this.sendMessageToBackend('newTask', JSON.parse(JSON.stringify(this.task)));
            }
        },
        sendMessageToBackend(command = null, args = null) {
            vscode.postMessage({ command: command, args: args });
        }
    }
}).mount('#app');