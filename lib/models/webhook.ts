import { IWebHookEvent } from "../types";

export class WebHook {
    id!: string;
    event!: IWebHookEvent;
    url!: string;
}



export const webhookFactory = (payload: any): WebHook => {
    return Object.assign(new WebHook(), payload);
};