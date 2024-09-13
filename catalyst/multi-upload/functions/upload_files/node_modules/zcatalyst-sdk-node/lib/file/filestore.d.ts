import { Folder } from './folder';
import { CatalystApp } from '../catalyst-app';
import { AuthorizedHttpClient } from '../utils/api-request';
import { Component } from '../utils/pojo/common';
export declare class Filestore implements Component {
    requester: AuthorizedHttpClient;
    constructor(app: CatalystApp);
    getComponentName(): string;
    createFolder(name: string): Promise<Folder>;
    getAllFolders(): Promise<Array<Folder>>;
    getFolderDetails(id: string | number): Promise<Folder>;
    folder(id: string | number): Folder;
}
