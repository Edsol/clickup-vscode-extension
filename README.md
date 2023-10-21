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

## Features
### Show/edit task

### Create new task

### "Working on" Mode

Through the menu in the Status Bar you can now select a task you are working on, once you have finished your changes you can change its status through the commit message.

Usage:

<img src="./docs/status.gif" height=500></img>

### Task status changer via commit message


## Extension Commands
This extension contributes the following commands:
* `clickup:refresh`: reload and update data of TreeView
* `clickup:setToken`: set personal token
* `clickup:deleteToken`: delete personal token 


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

## Translation
The extension supports English and Italian (my native language). You can help me translate it into your language, it will be very easy to do so:

1. Copy the `package.nls.json` file in the root of project and renaming it by adding the identifier for your language. For example for the Italian language the file will have the name `package.nls.it.json`
2. Copy the `bundle.l10n.json` file in the `l10n` folder and renaming it by adding the identifier for your language. For example for the Italian language the file will have the name `bundle.l10n.it.json`

## Release Notes
Detailed Release Notes are available [here](CHANGELOG.md)

## Do you want to support my work? Buy me an espresso coffee (I'm Italian)

<a href="https://www.buymeacoffee.com/edsol" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>