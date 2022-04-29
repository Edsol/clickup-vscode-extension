
const vscode = acquireVsCodeApi();

var tagify;

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
        tagify = new Tagify(document.getElementById("assignTo"), {
            enforceWhitelist: true,
            dropdown: {
                maxItems: 10,
                enabled: 0,
                closeOnSelect: false
            }
        });

        window.addEventListener("message", (event) => {
            const message = event.data;

            switch (message.command) {
                case "init":
                    this.members = message.data.members;
                    console.log('members', message.data.members);
                    tagify.whitelist = message.data.members;
                    tagify.addTags(message.data.members);
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