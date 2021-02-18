import { PaymentStatuses, ReceiptStatuses, RefundStatuses } from '../lib/core';
import { ICreatePayment, ICreateReceipt, ICreateRefund, ICreateWebHook } from '../lib/types';

export const createPaymentData: ICreatePayment = {
    amount: {
        value: '2.00',
        currency: 'RUB'
    },
    payment_method_data: {
        type: 'bank_card'
    },
    confirmation: {
        type: 'redirect',
        return_url: 'test'
    }
};

export const createPaymentResponse = {
    id: '219752e2-000f-50bf-b000-03f3dda898c8',
    status: PaymentStatuses.waiting_for_capture,
    paid: true,
    amount: { value: '2.00', currency: 'RUB' },
    confirmation:
    {
        type: 'redirect',
        return_url: 'https://www.merchant-website.com/return_url',
        confirmation_url:
            'https://api.yookassa.ru/v3/payments/kassa/confirmation?orderId=219752e2-000f-50bf-b000-03f3dda898c8',
    },
    created_at: '2017-11-10T05:54:42.563Z',
    metadata: {},
    payment_method:
    {
        type: 'bank_card',
        id: '219752e2-000f-50bf-b000-03f3dda898c8',
        saved: false,
    },
    recipient: { account_id: 'your_shop_id', gateway_id: 'gateaway_id' },
};

export const getPaymentResponse = {
    id: '219752e2-000f-50bf-b000-03f3dda898c8',
    status: PaymentStatuses.waiting_for_capture,
    paid: false,
    amount: { value: '2.00', currency: 'RUB' },
    created_at: '2017-11-10T05:54:42.563Z',
    metadata: {},
    payment_method:
    {
        type: 'bank_card',
        id: '219752e2-000f-50bf-b000-03f3dda898c8',
        saved: false,
    },
    recipient: { account_id: 'your_shop_id', gateway_id: 'gateaway_id' },
};

export const capturePaymentResponse = {
    id: '219752e2-000f-50bf-b000-03f3dda898c8',
    status: PaymentStatuses.succeeded,
    paid: true,
    amount: {
        value: '2.00',
        currency: 'RUB',
    },
    created_at: '2017-11-10T05:58:42.563Z',
    metadata: {},
    payment_method:
    {
        type: 'bank_card',
        id: '219752e2-000f-50bf-b000-03f3dda898c8',
        saved: false,
    },
    recipient: { account_id: 'your_shop_id', gateway_id: 'gateaway_id' },
};

export const cancelPaymentResponse = {
    id: '219752e2-000f-50bf-b000-03f3dda898c8',
    status: PaymentStatuses.canceled,
    paid: true,
    amount: {
        value: '2.00',
        currency: 'RUB',
    },
    created_at: '2017-11-10T05:58:42.563Z',
    metadata: {},
    payment_method:
    {
        type: 'bank_card',
        id: '219752e2-000f-50bf-b000-03f3dda898c8',
        saved: false,
    },
    recipient: { account_id: 'your_shop_id', gateway_id: 'gateaway_id' },
};

export const getPaymentListResponse = {
    type: 'list',
    items: [
      createPaymentResponse
    ],
    next_cursor: '37a5c87d-3984-51e8-a7f3-8de646d39ec15'
};

export const createRefundData: ICreateRefund = {
    payment_id: '219752e2-000f-50bf-b000-03f3dda898c8',
    amount: {
        value: '2.00',
        currency: 'RUB'
    }
};

export const createAndGetRefundResponse = {
    id: '219752e2-000f-50bf-b000-03f3dda898c8',
    status: RefundStatuses.succeeded,
    amount: {
        value: '1',
        currency: 'RUB',
    },
    authorized_at: '2017-11-10T19:27:51.609Z',
    created_at: '2017-10-04T19:27:51.407Z',
    payment_id: '219752e2-000f-50bf-b000-03f3dda898c8',
};

export const getRefundListResponse = {
    type: 'list',
    items: [
        createAndGetRefundResponse
    ],
    next_cursor: '416746f8-0016-50be-b000-078d43a4578'
};

export const createReceiptData: ICreateReceipt = {
    type: 'refund',
    refund_id: '219752e2-000f-50bf-b000-03f3dda898c8',
    customer: {
        email: 'test@gmail.com'
    },
    items: [
        {
            description: 'Наименование товара 1',
            quantity: '1.000',
            amount: {
                value: '14000.00',
                currency: 'RUB'
            },
            vat_code: 2,
            payment_mode: 'full_payment',
            payment_subject: 'commodity',
            country_of_origin_code: 'CN'
        },
    ],
    send: false,
    settlements: [
        {
            type: 'prepayment',
            amount: {
                value: '8000.00',
                currency: 'RUB'
            }
        },
    ]
};

export const createReceiptResponse = {
    id: 'rt_1da5c87d-0984-50e8-a7f3-8de646dd9ec9',
    type: 'refund',
    refund_id: createReceiptData.refund_id,
    status: ReceiptStatuses.succeeded,
    items: [
        {
            description: 'Наименование товара 1',
            quantity: '1.000',
            amount: {
                value: '14000.00',
                currency: 'RUB'
            },
            vat_code: 2,
            payment_mode: 'full_payment',
            payment_subject: 'commodity',
            country_of_origin_code: 'CN'
        },
    ],
    settlements: [
        {
            type: 'prepayment',
            amount: {
                value: '8000.00',
                currency: 'RUB'
            }
        },
    ],
    tax_system_code: 1
};

export const getReceiptResponse = {
    id: 'rt-2da5c87d-0384-50e8-a7f3-8d5646dd9e10',
    type: 'payment',
    status: ReceiptStatuses.succeeded,
    payment_id: '219752e2-000f-50bf-b000-03f3dda898c8',
    fiscal_document_number: '3997',
    fiscal_storage_number: '9288000100115786',
    fiscal_attribute: '2617603922',
    registered_at: '2019-09-18T10:06:42.985Z',
    fiscal_provider_id: 'fd9e9404-eaca-4000-8ec9-dc228ead2346',
    items: [
        {
            quantity: '5.000',
            amount: {
                value: '1500.30',
                currency: 'RUB'
            },
            vat_code: 2,
            description: 'Сapybara',
            payment_mode: 'full_payment',
            payment_subject: 'commodity'
        }
    ],
    tax_system_code: 1,
    settlements: [
        {
            type: 'cashless',
            amount: {
                value: '45.67',
                currency: 'RUB'
            }
        }
    ]
};

export const getReceiptListResponse = {
    type: 'list',
    items: [
        createReceiptResponse
    ],
    next_cursor: 'rt_67a4g56e-8487-56d4-a7f3-7yu646s78ec48'
};


export const createWebHookData: ICreateWebHook = {
    event: 'payment.canceled',
    url: 'test'
};

export const createWebHookResponse = {
    id: 'wh-edba6d49-ce3e-4d99-991b-4bb164859dc3',
    event: 'payment.canceled',
    url: 'test'
};

export const getWebhookListResponse = {
    type: 'list',
    items: [
       createWebHookResponse
    ],
    next_cursor: 'rt_67a4g56e-8487-56d4-a7f3-7yu646s78ec48'
};

export const getShopInfoResponse = {
    account_id: '1234',
    test: true,
    fiscalization_enabled: false,
    payment_methods: [ 'yoo_money', 'bank_card' ],
    status: 'enabled'
};