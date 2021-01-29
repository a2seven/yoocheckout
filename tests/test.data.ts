import { ICreatePayment, ICreateReceipt, ICreateRefund } from '../lib/types';
import { v4 as uuid } from 'uuid';

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
    status: 'waiting_for_capture',
    paid: true,
    amount: { value: '2.00', currency: 'RUB' },
    confirmation:
    {
        type: 'redirect',
        return_url: 'https://www.merchant-website.com/return_url',
        confirmation_url:
            'https://money.yandex.ru/payments/kassa/confirmation?orderId=219752e2-000f-50bf-b000-03f3dda898c8',
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
    status: 'waiting_for_capture',
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
    status: 'succeeded',
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
    status: 'canceled',
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
        {
            id: '22e12f66-000f-5000-8000-18db351245c7',
            status: 'waiting_for_capture',
            paid: true,
            amount: {
                value: '2.00',
                currency: 'RUB'
            },
            created_at: '2018-07-18T10:51:18.139Z',
            description: 'Заказ №72',
            expires_at: '2018-07-25T10:52:00.233Z',
            metadata: {},
            payment_method: {
                type: 'bank_card',
                id: '22e12f66-000f-5000-8000-18db351245c7',
                saved: false,
                card: {
                    first6: '555555',
                    last4: '4444',
                    expiry_month: '07',
                    expiry_year: '2022',
                    card_type: 'MasterCard',
                    issuer_country: 'RU',
                    issuer_name: 'Sberbank'
                },
                title: 'Bank card *4444'
            },
            recipient: {
                account_id: '100001',
                gateway_id: '1000001'
            },
            refundable: false,
            test: false
        }
    ],
    next_cursor: '37a5c87d-3984-51e8-a7f3-8de646d39ec15'
};

export const createRefundData: ICreateRefund = {
    payment_id: uuid(),
    amount: {
        value: '2.00',
        currency: 'RUB'
    }
};

export const createAndGetRefundResponse = {
    id: '219752f7-0016-50be-b000-078d43a63ae4',
    status: 'succeeded',
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
        {
            id: '216749f7-0016-50be-b000-078d43a63ae4',
            status: 'succeeded',
            amount: {
                value: '1',
                currency: 'RUB'
            },
            created_at: '2017-10-04T19:27:51.407Z',
            payment_id: '216749da-000f-50be-b000-096747fad91e'
        }
    ],
    next_cursor: '416746f8-0016-50be-b000-078d43a4578'
};

export const createReceiptData: ICreateReceipt = {
    type: 'refund',
    refund_id: uuid(),
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
    status: 'succeeded',
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
    status: 'succeeded',
    payment_id: '225d8da0-000f-50be-b000-0003308c89be',
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
        {
            id: 'rt_1da5c87d-0984-50e8-a7f3-8de646dd9ec9',
            type: 'payment',
            payment_id: '215d8da0-000f-50be-b000-0003308c89be',
            status: 'succeeded',
            fiscal_document_number: '3986',
            fiscal_storage_number: '9288000100115785',
            fiscal_attribute: '2617603921',
            registered_at: '2019-05-13T17:56:00.000+03:00',
            fiscal_provider_id: 'fd9e9404-eaca-4000-8ec9-dc228ead2345',
            items: [
                {
                    description: 'Сapybara',
                    quantity: '5.000',
                    amount: {
                        value: '2500.50',
                        currency: 'RUB'
                    },
                    vat_code: 2,
                    payment_mode: 'full_payment',
                    payment_subject: 'commodity'
                }
            ],
            tax_system_code: 1
        }
    ],
    next_cursor: 'rt_67a4g56e-8487-56d4-a7f3-7yu646s78ec48'
};