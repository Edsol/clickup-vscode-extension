/* eslint-disable @typescript-eslint/naming-convention */

export type Task = {
    archived: boolean,
    assignees: Assignee[],
    checklists: Checklist[],
    creator: Creator,
    customFields: CustomField[],
    customId: number,
    dateClosed: string,
    dateCreated: string,
    dateUpdated: string,
    dependecies: Dependecie[],
    description: string,
    dueDate: null,
    folder: Folder,
    id: string,
    linkedTasks: Task[],
    list: {
        id: string,
        name: string,
        access: boolean
    },
    name: string,
    orderId: string,
    orderindex: string;
    parent: string,
    top_level_parent: string,
    permissionLevel: string,
    points: null,
    priority: Priority,
    project: Project,
    space: Space,
    subtasks?: Task[],
    startDate: string,
    status: Status,
    tags: Tag[],
    team_id: string,
    textContent: string,
    timeSpend: number,
    url: string,
    watchers: Watcher[]
};

export type TaskUpdate = {
    name?: string,
    description?: string,
    status?: string,
    priority?: number,
    due_date?: number,
    due_date_time?: number,
    parent?: string,
    time_estimate?: number,
    start_date?: number,
    start_date_time?: number,
    points?: number,
    assignees?: AssigneesUpdate,
    group_assignees?: {
        add: string[],
        rem: string[]
    },
    archived?: boolean
};

export type AssigneesUpdate = {
    add: number[], rem: number[]
};

export type TaskLocation = {
    folder_id: string,
    list_id: string,
    space_id: string
};

export type Assignee = {
    id: number,
    username: string,
    color: string,
    initials: string,
    email: string
};

export type Comment = {
    id: string,
    comment: string[],
    comment_text: string,
    user: User,
    resolved: boolean,
    assignee: Assignee,
    assigned_by: Assignee,
    reactions?: any[],
    date: string,
    reply_count: string
};

export type Checklist = undefined;

export type Creator = {
    id: number,
    username: string,
    color: string,
    email: string,
    profilePicture: string
};

export type CustomField = undefined;
export type Dependecie = undefined;

export type Status = {
    id: string,
    status: string,
    color: string,
    hide_label: true,
    type: string,
    orderindex: number
};

export type List = {
    archived: boolean,
    assignee: boolean,
    deleted: boolean,
    id: string,
    inbound_adress: string,
    name: string,
    orderindex: number,
    override_statuses: boolean,
    permission_level: string,
    priority: number,
    space: Space,
    start_date: string,
    status: Status,
    statuses: Statuses[]
};

export type Statuses = {
    id: string,
    color: string,
    orderindex: number,
    status: string,
    type: string
};

export type Folder = {
    id: string,
    name: string,
    hidden: boolean,
    access: boolean
};

export type StoredPriorities = {
    time: number,
    priorities: Priority[]
};


export type Priority = {
    id: number,
    priority: string,
    color: string,
    orderindex: string
};

export type Project = {
    id: string,
    name: string,
    hidden: boolean,
    access: boolean
};

export type Space = {
    id: string,
    name: string,
    private: boolean,
    access: boolean,
    statuses: Status[],
    multiple_assignees: boolean,
    features: {
        priorities: {
            enabled: boolean,
            priorities: Priority[]
        }
    }
};

export type StoredTags = {
    time: number,
    tags: Tag[]
};

export type Tag = {
    name: string,
    tagFg: string,
    tagBg: string,
    creator: number
};

export type Watcher = undefined;

export type StoredMembers = {
    time: number,
    members: Member[]
};

export type Team = {
    id: string,
    name: string,
    color: string,
    avatar: unknown,
    members: Member[]
};

export type Member = {
    id: number,
    username: string,
    email: string,
    color: string,
    initials: string,
    profilePicture: string,
    profileInfo: ProfileInfo
};

export type ProfileInfo = {
    displayProfile: boolean,
    verifiedAmbassador: null,
    verifiedConsultant: null,
    topTierUser: null,
    viewedVerifiedAmbassador: null,
    viewedVerifiedConsultant: null,
    viewedTopTierUser: null
};


export type StoredStatuses = {
    time: number,
    statuses: Statuses[]
};

export type User = {
    color: string,
    email: string,
    id: number,
    initials: string,
    profilePicture?: string,
    username: string
};

export type Interval = {
    billable: boolean,
    date_added: string,
    description?: string,
    end: string,
    id: string,
    source: string,
    start: string,
    tags?: Tag[],
    time: string
};

export type Tracking = {
    intervals: Interval[],
    time: number,
    user: User
};

export type CreateTime = {
    description?: string,
    tags?: Tag[],
    start?: number,
    billable?: boolean,
    duration?: number,
    assignee?: number,
    tid: string,
    fromTimesheet?: boolean
};

export type Time = {
    at: string,
    billable: boolean,
    description: string,
    id: string,
    is_locked: boolean,
    source: "string",
    start: string,
    end?: string,
    duration: string,
    tags: Tag[],
    task: Task,
    task_location: TaskLocation,
    task_url: string,
    user: User,
    wid: string
};

/* eslint-enable @typescript-eslint/naming-convention */