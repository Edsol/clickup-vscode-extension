"use strict";
import * as path from "path";
const fs = require("fs");
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  extensions,
  commands,
  Uri,
  window,
  RelativePattern,
  ExtensionContext,
  workspace,
} from "vscode";

import Timer from "./timer";
import { ColorsViewProvider } from "./view";

let timer: Timer;
let gitBranch: string | undefined;
export let jsonPath: string | undefined;
export var data = JSON.parse("{}");
const workspacePath = workspace.workspaceFolders![0].uri.path;
const gitpath = path.join(workspacePath, ".git");
const headpath = path.join(gitpath, "HEAD");
const BRANCH_PREFIX = "ref: refs/heads/";// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  jsonPath = path.join(workspacePath, ".vscode/branch-timer.json");
  gitBranch = getCurrentGitBranch();
  addToGitIgnore(workspacePath);
  timer = new Timer(gitBranch!);
  checkWindowFocus(timer);
  if (fs.existsSync(jsonPath)) {
    var jsonFile: string = fs.readFileSync(jsonPath, "utf8");
    data = JSON.parse(jsonFile);
    data = Object.fromEntries(
      Object.entries(data).sort(([, valueA], [, valueB]) => {
        return (valueB as number) - (valueA as number);
      })
    );
    timer.total = data[gitBranch!] ?? 0;
  } else {
    // create the directory if it doesn't exist
    const dirPath = path.dirname(jsonPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // create the file
    fs.writeFileSync(jsonPath, JSON.stringify({}));
  }
  const provider = new ColorsViewProvider(context.extensionUri);

  context.subscriptions.push(
    window.registerWebviewViewProvider(ColorsViewProvider.viewType, provider)
  );
  const pattern = new RelativePattern(gitpath, "HEAD");
  const watcher = workspace.createFileSystemWatcher(pattern, false, false);
  watcher.onDidCreate((e) => {
    updateBranch();
    provider.updateHtml();
    console.log(".git/HEAD create detected");
  });
  watcher.onDidChange((e) => {
    updateBranch();
    provider.updateHtml();
    console.log(".git/HEAD change detected");
  });
  workspace.onDidChangeConfiguration((e) => {
    updateBranch();
    provider.updateHtml();
    console.log("Configuration change detected");
  });

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let startTimer = commands.registerCommand("extension.startTimer", () => {
    timer.start();
  });
  let showTimer = commands.registerCommand("extension.showTimer", () => {
    timer.showTimer();
  });
  let stopTimer = commands.registerCommand("extension.stopTimer", () => {
    timer.stop();
  });
  let copyTimer = commands.registerCommand("extension.copyTimer", () => {
    timer.copyTimer();
  });

  context.subscriptions.push(showTimer);
  context.subscriptions.push(stopTimer);
  context.subscriptions.push(copyTimer);
  context.subscriptions.push(startTimer);
}

function updateBranch() {
  data[gitBranch!] = timer.total;
  gitBranch = getCurrentGitBranch();
  timer.stop();
  timer.branchName = gitBranch;
  timer.total = data[gitBranch!] ?? 0;
  var jsonData = JSON.stringify(data);
  fs.writeFile(jsonPath, jsonData, (error: any) => {
    if (error) {
      console.log("An error has occurred ", error);
      return;
    }
    console.log("Data written successfully to disk", gitBranch);
  });
  timer.start();
}
// this method is called when your extension is deactivated
export function deactivate() {
  updateBranch();
}

function getCurrentGitBranch(): string {
  var file = fs.readFileSync(headpath, "utf-8");
  const line = file.split(/\r\n|\r|\n/)[0];
  const branch = line.replace(BRANCH_PREFIX, "");
  return branch;
}

function addToGitIgnore(workspacePath: string) {
  var branchTimerPath = ".vscode/branch-timer.json";
  const gitIgnore = path.join(workspacePath, ".gitignore");
  if (fs.existsSync(gitIgnore)) {
    var gitIgnoreFile: string = fs.readFileSync(gitIgnore, "utf8");
    if (!gitIgnoreFile.includes(branchTimerPath)) {
      fs.appendFile(gitIgnore, branchTimerPath, function (err: any) {
        if (err) {
          console.log(err);
        }
        console.log("Added branch timer file to gitignore!");
      });
    } else {
      console.log("Already Added");
    }
  }
}

function checkWindowFocus(timer: Timer) {
  const windowState = window.state;
  let isFocused = windowState.focused;

  // Listen for changes in the window state
  window.onDidChangeWindowState((event) => {
    isFocused = event.focused;

    if (isFocused) {
      console.log("VSCode is focused");
      timer.start();
    } else {
      console.log("VSCode is not focused");
      timer.stop();
    }
  });
}
