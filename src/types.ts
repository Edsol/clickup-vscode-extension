export type StoredTasksT = {
    tasks: {
        id: string,
        name: string
    }
};

export type Task = {
    id: string,
    name: string,
    description: string,
    teamId: string,
    textContent: string,
    url: string,
    list: List,
    creator: Creator,
    folder: Folder,
    status: Status,
    priority?: Priority[]
};

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

export type Creator = {
    id: number,
    username: string,
    color: string,
    email: string,
    profilePicture: string
};

export type Priority = {
    id: number,
    priority: string,
    color: string,
    orderindex: string
};