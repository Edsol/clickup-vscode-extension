export class Utils {
    window: any;

    constructor(window: any) {
        this.window = window;
    }

    confirmDialog(message: string, yesCallback?: CallableFunction, noCallable?: CallableFunction) {
        this.window.showInformationMessage("Are you sure you want to eliminate this task?", "Yes", "No")
            .then((answer: string) => {
                if (answer === "Yes") {
                    if (yesCallback) {
                        yesCallback();
                    }
                } else {
                    if (noCallable) {
                        noCallable();
                    }
                }
            });
    }
}