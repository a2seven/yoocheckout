import axios from 'axios';
import { v4 as uuid } from 'uuid';
import {
    errorFactory,
    ErrorResponse,
    Payment,
    paymentFactory,
    Receipt,
    receiptFactory,
    Refund,
    refundFactory,
    WebHook,
    webhookFactory,
    Me,
    meFactory
} from '../models';
import {
    ICapturePayment,
    ICreatePayment,
    ICreateReceipt,
    ICreateRefund,
    IGetRefundList,
    IGetPaymentList,
    IPaymentList,
    IYooCheckoutOptions,
    IRefundList,
    IReceiptList,
    IGetReceiptList,
    ICreateWebHook,
    IWebHookList
} from '../types';
import { apiUrl } from '.';
const DEFAUL = {
    PACKAGE_VERSION: '1',
    DEFAULT_DEBUG: false,
    // tslint:disable-next-line: no-require-imports
};

export class YooCheckout {
    public shopId: string;
    public secretKey: string;
    public root: string;
    public debug: boolean;
    constructor(private readonly options: IYooCheckoutOptions) {
        this.shopId = this.options.shopId;
        this.secretKey = this.options.secretKey;
        this.debug = options.debug || DEFAUL.DEFAULT_DEBUG;
        this.root = apiUrl;
    }

    private buildQuery(filters: IGetPaymentList | IGetRefundList | IGetReceiptList): string {
        let queryString = '?';
        // tslint:disable-next-line: forin
        for (const key in filters) {
            const filter = (filters as any)[key];
            if (queryString !== '?') {
                queryString = `${queryString}&`;
            }
            if (filter['value'] && filter['mode']) {
                queryString = `${queryString}${key}.${filter['mode']}=${filter['value']}`;
            } else {
                queryString = `${queryString}${key}=${filter}`;
            }
        }
        return queryString === '?' ? '' : queryString;
    }

    /**
     * Create payment
     * @see 'https://yookassa.ru/developers/api#create_payment'
     * @param {Object} payload
     * @paramExample
     * {
     *   "amount": { "value": '2.00', "currency": 'RUB' },
     *   "payment_method_data": { "type": 'bank_card'  },
     *   "confirmation": { "type": 'redirect', "return_url": 'https://www.merchant-website.com/return_url' }
     * }
     * @param {string} idempotenceKey
     * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
     * @returns {Promise<Payment>}
     */
    public createPayment(payload: ICreatePayment, idempotenceKey: string = uuid()): Promise<Payment> {
        return new Promise((resolve, reject) => {
            axios.post(`${this.root}/payments`, payload, {
                auth: {
                    username: this.shopId,
                    password: this.secretKey,
                },
                headers: {
                    'Idempotence-Key': idempotenceKey,
                }
            }).then(res => {
                resolve(paymentFactory(res.data));
            }).catch((error) => {
                const err: ErrorResponse = errorFactory({ ...error.response.data, errorCode: error.response.status });
                console.error(err);
                reject(err);
            });
        });
    }

    /**
     * Get payment by id
     * @see 'https://yookassa.ru/developers/api#get_payment'
     * @param {string} paymentId
     * @paramExample '215d8da0-000f-50be-b000-0003308c89be'
     * @returns {Promise<Payment>}
     */
    public getPayment(paymentId: string): Promise<Payment> {
        return new Promise((resolve, reject) => {
            axios.get(`${this.root}/payments/${paymentId}`,
                {
                    auth: {
                        username: this.shopId,
                        password: this.secretKey,
                    }
                }).then(res => {
                    resolve(paymentFactory(res.data));
                }).catch((error) => {
                    const err: ErrorResponse = errorFactory({ ...error.response.data, errorCode: error.response.status });
                    reject(err);
                });
        });
    }

    /**
     * Capture payment
     * @see 'https://yookassa.ru/developers/api#capture_payment'
     * @param {string} paymentId
     * @paramExample '215d8da0-000f-50be-b000-0003308c89be'
     * @param {Object} payload
     * @paramExample
     * {
     *   "amount": { "value": '2.00', "currency": 'RUB' }
     * }
     * @param {string} idempotenceKey
     * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
     * @returns {Promise<Payment>}
     */
    public capturePayment(paymentId: string, payload: ICapturePayment, idempotenceKey: string = uuid()): Promise<Payment> {
        return new Promise((resolve, reject) => {
            axios.post(`${this.root}/payments/${paymentId}/capture`, payload, {
                auth: {
                    username: this.shopId,
                    password: this.secretKey,
                },
                headers: {
                    'Idempotence-Key': idempotenceKey,
                }
            }).then(res => {
                resolve(paymentFactory(res.data));
            }).catch((error) => {
                const err: ErrorResponse = errorFactory({ ...error.response.data, errorCode: error.response.status });
                console.error(err);
                reject(err);
            });
        });
    }

    /**
     * Cancel paymnet
     * @see 'https://yookassa.ru/developers/api#cancel_payment'
     * @param {string} paymentId
     * @paramExample '215d8da0-000f-50be-b000-0003308c89be'
     * @param {string} idempotenceKey
     * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
     * @returns {Promise<Payment>}
     */
    public cancelPayment(paymentId: string, idempotenceKey: string = uuid()): Promise<Payment> {
        return new Promise((resolve, reject) => {
            axios.post(`${this.root}/payments/${paymentId}/cancel`, {}, {
                auth: {
                    username: this.shopId,
                    password: this.secretKey,
                },
                headers: {
                    'Idempotence-Key': idempotenceKey,
                }
            }).then(res => {
                resolve(paymentFactory(res.data));
            }).catch((error) => {
                const err: ErrorResponse = errorFactory({ ...error.response.data, errorCode: error.response.status });
                console.error(err);
                reject(err);
            });
        });
    }

    /**
     * Get payment list
     * @see 'https://yookassa.ru/developers/api#get_payments_list'
     * @param {Object} filters
     * @paramExample
     * {
     *  "created_at": { "value": '2021-01-27T13:58:02.977Z', "mode": 'gte' },
     *  "limit": 20
     * }
     * @returns {Promise<Object>}
     */
    public getPaymentList(filters: IGetPaymentList = {}): Promise<IPaymentList> {
        return new Promise((resolve, reject) => {
            axios.get(`${this.root}/payments${this.buildQuery(filters)}`,
                {
                    auth: {
                        username: this.shopId,
                        password: this.secretKey,
                    }
                }).then(res => {
                    const response = { ...res.data };
                    response.items = response.items.map((i: any) => paymentFactory(i));
                    resolve(response);
                }).catch((error) => {
                    const err: ErrorResponse = errorFactory({ ...error.response.data, errorCode: error.response.status });
                    console.error(err);
                    reject(err);
                });
        });
    }

    /**
     * Create refund
     * @see 'https://yookassa.ru/developers/api#create_refund'
     * @param {Object} payload
     * @paramExample
     * {
     *     "payment_id": '6daac9fa-342d-4264-91c5-b5eafd1a0010'
     *     "amount": { "value": '2.00', "currency": 'RUB' }
     * }
     * @param {string} idempotenceKey
     * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
     * @returns {Promise<Refund>}
     */
    public createRefund(payload: ICreateRefund, idempotenceKey: string = uuid()): Promise<Refund> {
        return new Promise((resolve, reject) => {
            axios.post(`${this.root}/refunds`, payload, {
                auth: {
                    username: this.shopId,
                    password: this.secretKey,
                },
                headers: {
                    'Idempotence-Key': idempotenceKey,
                }
            }).then(res => {
                resolve(refundFactory(res.data));
            }).catch((error) => {
                const err: ErrorResponse = errorFactory({ ...error.response.data, errorCode: error.response.status });
                console.error(err);
                reject(err);
            });
        });
    }

    /**
     * Get refund by id
     * @see 'https://yookassa.ru/developers/api#get_refund'
     * @param {string} refundId
     * @paramExample '216749f7-0016-50be-b000-078d43a63ae4'
     * @returns {Promise<Refund>}
     */
    public getRefund(refundId: string): Promise<Refund> {
        return new Promise((resolve, reject) => {
            axios.get(`${this.root}/refunds/${refundId}`,
                {
                    auth: {
                        username: this.shopId,
                        password: this.secretKey,
                    }
                }).then(res => {
                    resolve(refundFactory(res.data));
                }).catch((error) => {
                    const err: ErrorResponse = errorFactory({ ...error.response.data, errorCode: error.response.status });
                    console.error(err);
                    reject(err);
                });
        });
    }

    /**
     * Get refund list
     * @see 'https://yookassa.ru/developers/api#get_refunds_list'
     * @param {Object} filters
     * @paramExample
     * {
     *  "created_at": { "value": '2021-01-27T13:58:02.977Z', "mode": 'gte' },
     *  "limit": 20
     * }
     * @returns {Promise<Object>}
     */
    public getRefundList(filters: IGetRefundList = {}): Promise<IRefundList> {
        return new Promise((resolve, reject) => {
            axios.get(`${this.root}/refunds${this.buildQuery(filters)}`,
                {
                    auth: {
                        username: this.shopId,
                        password: this.secretKey,
                    }
                }).then(res => {
                    const response = { ...res.data };
                    response.items = response.items.map((i: any) => refundFactory(i));
                    resolve(response);
                }).catch((error) => {
                    const err: ErrorResponse = errorFactory({ ...error.response.data, errorCode: error.response.status });
                    console.error(err);
                    reject(err);
                });
        });
    }

    /**
     * Create receipt
     * @see 'https://yookassa.ru/developers/api#create_receipt'
     * @param {Object} payload
     * @paramExample
     * {
     *     "send": true,
     *     "customer": { "email": 'test@gmail.com' },
     *     "settlements": [{"type": 'cashless', "amount": { "value": '2.00', "currency": 'RUB' }}],
     *     "refund_id": '27a387af-0015-5000-8000-137da144ce29',
     *     "type": 'refund',
     *     "items": [{ "description": 'test', "quantity": '2', "amount": { "value": '1.00', "currency": 'RUB' }, "vat_code": 1 }]
     * }
     * @param {string} idempotenceKey
     * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
     * @returns {Promise<Receipt>}
     */
    public createReceipt(payload: ICreateReceipt, idempotenceKey: string = uuid()): Promise<Receipt> {
        return new Promise((resolve, reject) => {
            axios.post(`${this.root}/receipts`, payload, {
                auth: {
                    username: this.shopId,
                    password: this.secretKey,
                },
                headers: {
                    'Idempotence-Key': idempotenceKey,
                }
            }).then(res => {
                resolve(receiptFactory(res.data));
            }).catch((error) => {
                const err: ErrorResponse = errorFactory({ ...error.response.data, errorCode: error.response.status });
                console.error(err);
                reject(err);
            });
        });
    }

    /**
     * Get receipt by id
     * @see 'https://yookassa.ru/developers/api#get_receipt'
     * @param {string} receiptId
     * @paramExample '216749f7-0016-50be-b000-078d43a63ae4'
     * @returns {Promise<Receipt>}
     */
    public getReceipt(receiptId: string): Promise<Receipt> {
        return new Promise((resolve, reject) => {
            axios.get(`${this.root}/receipts/${receiptId}`,
                {
                    auth: {
                        username: this.shopId,
                        password: this.secretKey,
                    }
                }).then(res => {
                    resolve(receiptFactory(res.data));
                }).catch((error) => {
                    const err: ErrorResponse = errorFactory({ ...error.response.data, errorCode: error.response.status });
                    console.error(err);
                    reject(err);
                });
        });
    }

    /**
     * Get receipt list
     * @see 'https://yookassa.ru/developers/api#get_receipts_list'
     * @param {Object} filters
     * @paramExample
     * {
     *  "created_at": { "value": '2021-01-27T13:58:02.977Z', "mode": 'gte' },
     *  "limit": 20
     * }
     * @returns {Promise<Object>}
     */
    public getReceiptList(filters: IGetReceiptList = {}): Promise<IReceiptList> {
        return new Promise((resolve, reject) => {
            axios.get(`${this.root}/receipts${this.buildQuery(filters)}`,
                {
                    auth: {
                        username: this.shopId,
                        password: this.secretKey,
                    }
                }).then(res => {
                    const response = { ...res.data };
                    response.items = response.items.map((i: any) => receiptFactory(i));
                    resolve(response);
                }).catch((error) => {
                    const err: ErrorResponse = errorFactory({ ...error.response.data, errorCode: error.response.status });
                    console.error(err);
                    reject(err);
                });
        });
    }
    /**
     * Create webhook
     * @see 'https://yookassa.ru/developers/api#create_webhook
     * @param {Object} payload
     * @paramExample
     * {
     *  "event": "payment.canceled",
     *  "url": "https://test.com/hook"
     * }
     * @param {string} idempotenceKey
     * @paramExample '6daac9fa-342d-4264-91c5-b5eafd1a0010'
     * @returns {Promise<Object>}
     */
    public createWebHook(payload: ICreateWebHook, idempotenceKey: string = uuid()): Promise<WebHook> {
        return new Promise((resolve, reject) => {
            if (!this.options.token) {
                console.error('Web hook functionality is only available with an OAuth token');
                reject(errorFactory({
                    id: uuid(),
                    code: 'Internal error',
                    errorCode: 500,
                    description: 'Web hook functionality is only available with an OAuth token',
                    parameter: 'Authorization',
                    type: 'Internal'
                }));
                return;
            }
            axios.post(`${this.root}/webhooks`, payload, {
                headers: {
                    'Idempotence-Key': idempotenceKey,
                    'Authorization': `Bearer ${this.options.token}`
                }
            }).then(res => {
                resolve(webhookFactory(res.data));
            }).catch((error) => {
                const err: ErrorResponse = errorFactory({ ...error.response.data, errorCode: error.response.status });
                console.error(err);
                reject(err);
            });
        });
    }

    /**
     * Get webhook list
     * @see 'https://yookassa.ru/developers/api#get_webhook_list'
     * @returns {Promise<Object>}
     */
    public getWebHookList(): Promise<IWebHookList> {
        return new Promise((resolve, reject) => {
            if (!this.options.token) {
                console.error('Web hook functionality is only available with an OAuth token');
                reject(errorFactory({
                    id: uuid(),
                    code: 'Internal error',
                    errorCode: 500,
                    description: 'Web hook functionality is only available with an OAuth token',
                    parameter: 'Authorization',
                    type: 'Internal'
                }));
                return;
            }
            axios.get(`${this.root}/webhooks`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.options.token}`
                    }
                }).then(res => {
                    const response = { ...res.data };
                    response.items = response.items.map((i: any) => webhookFactory(i));
                    resolve(response);
                }).catch((error) => {
                    const err: ErrorResponse = errorFactory({ ...error.response.data, errorCode: error.response.status });
                    console.error(err);
                    reject(err);
                });
        });
    }
    /**
     * Create webhook
     * @see 'https://yookassa.ru/developers/api#create_webhook
     * @param {string} id
     * @paramExample
     * wh-edba6d49-ce3e-4d99-991b-4bb164859dc3
     * @returns {Promise<Object>}
     */
    public deleteWebHook(id: string): Promise<{}> {
        return new Promise((resolve, reject) => {
            if (!this.options.token) {
                console.error('Web hook functionality is only available with an OAuth token');
                reject(errorFactory({
                    id: uuid(),
                    code: 'Internal error',
                    errorCode: 500,
                    description: 'Web hook functionality is only available with an OAuth token',
                    parameter: 'Authorization',
                    type: 'Internal'
                }));
                return;
            }
            axios.delete(`${this.root}/webhooks/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.options.token}`
                    }
                }).then(() => {
                    resolve({});
                }).catch((error) => {
                    const err: ErrorResponse = errorFactory({ ...error.response.data, errorCode: error.response.status });
                    console.error(err);
                    reject(err);
                });
        });
    }
    /**
     * Get shop info
     * @see 'https://yookassa.ru/developers/api#get_me'
     * @returns {Promise<Object>}
     */
    public getShop(): Promise<Me> {
        return new Promise((resolve, reject) => {
            if (!this.options.token) {
                console.error('Shop information is only available with an OAuth token');
                reject(errorFactory({
                    id: uuid(),
                    code: 'Internal error',
                    errorCode: 500,
                    description: 'Shop information is only available with an OAuth token',
                    parameter: 'Authorization',
                    type: 'Internal'
                }));
                return;
            }
            axios.get(`${this.root}/me`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.options.token}`
                    }
                }).then((res) => {
                    resolve(meFactory(res.data));
                }).catch((error) => {
                    const err: ErrorResponse = errorFactory({ ...error.response.data, errorCode: error.response.status });
                    console.error(err);
                    reject(err);
                });
        });
    }

}