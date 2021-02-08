export class WebHook {
    id!: string;
    event!: 'payment.waiting_for_capture' | 'payment.succeeded' | 'payment.canceled' | 'refund.succeeded';
    url!: string;
}



export const webhookFactory = (payload: any): WebHook => {
    return Object.assign(new WebHook(), payload);
};