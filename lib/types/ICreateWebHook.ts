import { IWebHookEvent } from "./IWebHookEvent";

export interface ICreateWebHook {
    event: IWebHookEvent;
    url: string;
}