export interface ICreateWebHook {
    event: 'payment.waiting_for_capture' | 'payment.succeeded' | 'payment.canceled' | 'refund.succeeded';
    url: string;
}