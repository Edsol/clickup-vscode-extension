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
    list: List,
    name: string,
    orderId: string,
    orderindex: string;
    parent: Parent,
    permissionLevel: string,
    points: null,
    priority: Priority,
    project: Project,
    space: Space,
    startDate: string,
    status: Status,
    tags: Tag[],
    teamId: string,
    textContent: string,
    timeSpend: number,
    url: string,
    watchers: Watcher[]
};

export type Assignee = {
    id: number,
    username: string,
    color: string,
    initials: string,
    email: string
};

export type Checklist = {};

export type Creator = {
    id: number,
    username: string,
    color: string,
    email: string,
    profilePicture: string
};

export type CustomField = {};
export type Dependecie = {};
export type Parent = {};

export type Status = {
    status: string,
    color: string,
    type: string,
    orderindex: number
};

export type List = {
    id: string,
    name: string,
    access: boolean
};

export type Folder = {
    id: string,
    name: string,
    hidden: boolean,
    access: boolean
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
    id: string
};

export type Tag = {
    name: string,
    tagFg: string,
    tagBg: string,
    creator: number
};

export type Watcher = {};

export type StoredMembers = {
    time: number,
    members: Member[]
}

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