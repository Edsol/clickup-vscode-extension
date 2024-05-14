<h1 align='center'>
Unofficial <a href="http://clickup.com">ClickUp</a> VSCode extension

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue)](https://www.gnu.org/licenses/agpl-3.0)

</h1>

## Requirements

You need to have a ClickUp token to interact with your private task, use [official guide](https://docs.clickup.com/en/articles/1367130-getting-started-with-the-clickup-api) to create one

## Install

Use command:

```
ext install edsol.clickup
```

or find it in [marketpace](https://marketplace.visualstudio.com/items?itemName=edsol.clickup)

## Inizialize

Use the dedicated command to manipulate API token:

### Token

- `Clickup: Set token`
- `Clickup: show token`
- `Clickup: delete token`

## Features

### List task

View tasks within lists, folders, spaces

![list](./docs/list_task.png)

### Task functions

edit, delete, or use a task:

![functions](./docs/edit_task.png)

### Create new task

Add a new task in any list:

![new-task](./docs/new_task.png)

### "Working on" Mode

Through the menu in the Status Bar you can now select a task you are working on, once you have finished your changes you can change its status through the commit message.

Usage:

<img src="./docs/status.gif" height=500></img>

we can also work on a specific task by selecting it from the list:

![work-on-task](./docs/work_on.png)

### Task status changer via commit message

We can change the status of the task directly in the commit message.

Select a task with the instructions above and use dedicated button in git tab:

![select-task](./docs/select_task.png)

select a new status from list:

![select-status](./docs/select_status.png)

complete commit message and push it:

![commit_message](./docs/commit_message.png)

### My Task section

Implemented new "My Task" section (thanks to [@HeIIow2](https://github.com/HeIIow2) for suggesting it), All the tasks assigned to us are displayed:

![commit_message](./docs/my_task_section.png)

### Time tracker

Added functionality to track time on tasks, you can view the list of times by user

> [!IMPORTANT]  
> Time tracker is on by default, it can be turned off in the extension setting menu.

## How to configure the extension

Go to `Settings > Extension > ClickUp` and change the parameters to configure to your liking the extension.

## Roadmap

- [x] Task counter badge
- [x] Easy way to edit status outside edit mode
- [x] Manage via global settings
- [ ] Increase performaces
- [ ] Add filters and groupings
- [x] Implements time tracking
- [x] Add and delete list insde a space
- [x] Create and delete spaces
- [x] Refresh TreeView button
- [x] Collapse TreeView button
- [x] Create new List
- [x] load task informations in real time
- [x] translation support
- [x] "my task" section

## Translation

The extension supports English and Italian (my native language). You can help me translate it into your language, it will be very easy to do so:

1. Copy the `package.nls.json` file in the root of project and renaming it by adding the identifier for your language. For example for the Italian language the file will have the name `package.nls.it.json`
2. Copy the `bundle.l10n.json` file in the `l10n` folder and renaming it by adding the identifier for your language. For example for the Italian language the file will have the name `bundle.l10n.it.json`

## Release Notes

Detailed Release Notes are available [here](CHANGELOG.md)

## Do you want to support my work? Buy me an espresso coffee (I'm Italian)

<a href="https://www.buymeacoffee.com/edsol" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
