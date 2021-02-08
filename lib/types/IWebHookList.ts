import { WebHook } from "../models";
import { IBaseList } from ".";

export interface IWebHookList extends IBaseList {
    items: WebHook[];
}