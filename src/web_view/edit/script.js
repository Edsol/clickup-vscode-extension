
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
        tagifyAssignTo = new Tagify(document.getElementById("assignTo"), tagifyOptions);
        tagifyStatuses = new Tagify(document.getElementById("statuses"), tagifySelectOptions);

        tagifyTags = new Tagify(document.getElementById("tags"), tagifyOptions);
        tagifyPriorities = new Tagify(document.getElementById("priority"), tagifySelectOptions);

        window.addEventListener("message", (event) => {
            const message = event.data;

            switch (message.command) {
                case "init":
                    console.log(message.data.task);
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

                    this.popolateFields(message.data.task);
                    break;
            }
        });
    },
    methods: {
        popolateFields(task) {
            this.task = task;
            this.selectedMember = task.assignees[0].id;
        },
        checkForm: function (e) {
            if (!this.task.name) {
                this.sendMessageToBackend("error", "Title is required.");
            } else if (!this.task.description) {
                this.sendMessageToBackend("error", "Description is required.");
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