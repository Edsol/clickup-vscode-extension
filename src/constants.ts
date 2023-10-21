import * as vscode from 'vscode';
import * as l10n from '@vscode/l10n';

if (vscode.l10n.uri?.fsPath) {
    l10n.config({
        fsPath: vscode.l10n.uri?.fsPath
    });
}

export const CLICKUP_COM_URL = 'https://clickup.com';
export const TASKS_STORED_KEY = 'clickup_tasks_list';
export const MEMBERS_STORED_KEY = 'clickup_member_list';
export const STATUS_STORED_KEY = 'clickup_status_list';
export const TAGS_STORED_KEY = 'clicup_tags_list';
export const PRIORITIES_STORED_KEY = 'clicup_priority_list';

// extension.ts
export const NO_CLICKUP_TOKEN_SET = l10n.t('No clickup token has been set!');
export const TASK_TOOLTIP = l10n.t("ClickUp Task you are working on");
export const TASK_REMOVED = l10n.t(`Task was removed`);
export const SET_TOKEN = l10n.t('Your token has been successfully saved');
export const DELETE_TOKEN = l10n.t('Your token has been successfully deleted');
export const NO_TASK_SELECTED = l10n.t(`No ClickUp task has been selected`);
export const NO_LIST_ID = l10n.t(`Impossible to retrieve states from reference list`);
export const STATUS_READ_ERROR = l10n.t(`I couldn't read the status`);


export const TASK_SAVE_ERROR_MESSAGE = l10n.t('An error occurred while saving');
export const TASK_SAVE_SUCCESS_MESSAGE = l10n.t('New task was created');
export const TASK_UPDATE_MESSAGE = l10n.t('Task updated');
export const TASK_UPDATE_ERROR_MESSAGE = l10n.t('An error occurred while updating');
export const TASK_DELETE_MESSAGE = l10n.t("Are you sure you want to eliminate this Task?");

export const SPACE_DELETE_MESSAGE = l10n.t("Are you sure you want to eliminate this Space?");

export const LIST_DELETE_MESSAGE = l10n.t("Are you sure you want to eliminate this List?");

export const DEFAULT_TASK_DETAILS = [
    'id', 'name', 'description', 'url', 'status', 'priority', 'creator', 'tags', 'assignees'
];