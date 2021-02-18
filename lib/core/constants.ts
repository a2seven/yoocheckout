export const apiUrl = 'https://api.yookassa.ru/v3';

export const DEFAULT = {
    PACKAGE_VERSION: '1',
    DEFAULT_DEBUG: false,
    // tslint:disable-next-line: no-require-imports
};

export enum PaymentStatuses {
    'waiting_for_capture' = 'waiting_for_capture',
    'pending' = 'pending',
    'succeeded' = 'succeeded',
    'canceled' = 'canceled'
}


export enum ReceiptStatuses {
    'pending' = 'pending',
    'succeeded' = 'succeeded',
    'canceled' = 'canceled'
}

export enum WebHookEvents {
    'payment.waiting_for_capture' = 'payment.waiting_for_capture',
    'payment.succeeded' = 'payment.succeeded',
    'payment.canceled' = 'payment.canceled',
    'refund.succeeded' = 'refund.succeeded'
}

export enum RefundStatuses {
    'canceled' = 'canceled',
    'succeeded' = 'succeeded'
}