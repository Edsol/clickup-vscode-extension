
const vscode = acquireVsCodeApi();

Vue.createApp({
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
            mcuHeros: [
                { value: "ironman", code: "im" },
                { value: "antman", code: "am" },
                { value: "captain america", code: "ca" },
                { value: "thor", code: "th" },
                { value: "spiderman", code: "sm" }
            ],
            tagifySettings: {
                whitelist: [],
                dropdown: {
                    enabled: 0
                },
                callbacks: {
                    add(e) {
                        // console.log("tag added:", e.detail);
                    }
                }
            },
        };
    },
    mounted() {
        console.log('mounted');
        this.sendMessageToBackend("getMembers");

        window.addEventListener("message", (event) => {
            const data = event.data;

            switch (data.command) {
                case "loadMembers":
                    this.members = data.data;
                    break;
                case "taskData":
                    this.popolateFields(data.data);
                    break;
            }
        });

        var input = document.getElementById("onlyMarvel");
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
    },
}).mount("#app");