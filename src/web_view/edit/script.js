
const vscode = acquireVsCodeApi();

var tagifyAssignTo;
var tagifyStatuses;

const tagifyOptions = {
    enforceWhitelist: true,
    userInput: false,
    dropdown: {
        maxItems: 10,
        enabled: 0,
        closeOnSelect: false
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
        tagifyStatuses = new Tagify(document.getElementById("statuses"), {
            enforceWhitelist: true,
            userInput: false,
            mode: "select",
            dropdown: {
                maxItems: 10,
                enabled: 0,
                closeOnSelect: true
            }
        });

        window.addEventListener("message", (event) => {
            const message = event.data;

            switch (message.command) {
                case "init":
                    this.members = message.data.members;
                    tagifyAssignTo.whitelist = message.data.members;
                    tagifyAssignTo.addTags(message.data.members);

                    this.statuses = message.data.statuses;
                    tagifyStatuses.whitelist = message.data.statuses;
                    console.log('message.data.statuses', message.data.statuses, message.data.task);
                    tagifyStatuses.addTags(message.data.task.status.status);


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