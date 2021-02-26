import axios from 'axios';
import { v4 as uuid } from 'uuid';
import {
    errorFactory,
    Payment,
    paymentFactory,
    Receipt,
    receiptFactory,
    Refund,
    refundFactory,
    WebHook,
    webhookFactory,
    Me,
    meFactory,
    ErrorResponse
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
import { apiUrl, DEFAULT } from '.';

export class YooCheckout {
    public readonly shopId: string;
    public readonly secretKey: string;
    public readonly root: string;
    public readonly debug: boolean;
    constructor(private readonly options: IYooCheckoutOptions) {
        this.shopId = this.options.shopId;
        this.secretKey = this.options.secretKey;
        this.debug = options.debug || DEFAULT.DEFAULT_DEBUG;
        this.root = apiUrl;
    }

    private authData() {
        return {
            username: this.shopId,
            password: this.secretKey,
        };
    }

    private buildQuery(filters: IGetPaymentList | IGetRefundList | IGetReceiptList): string {
        const entries = Object.entries(filters);
        const queryString = entries.reduce((sum, [param, value], index) => (
            value['value'] && value['mode']
                ? `${sum}${param}.${value['mode']}=${value['value']}${index < entries.length - 1 ? '&' : ''}`
                : `${sum}${param}=${value}${index < entries.length - 1 ? '&' : ''}`
        ), '?');

        return queryString === '?' ? '' : queryString;
    }

    private normalizeFilter(filters: any) {
        if(!Boolean(filters)) {
            return {};
        }

        return {...filters};
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
    public async createPayment(payload: ICreatePayment, idempotenceKey: string = uuid()): Promise<Payment> {
        try {
            const options = { auth: this.authData(), headers: { 'Idempotence-Key': idempotenceKey } };
            const { data } = await axios.post(`${this.root}/payments`, payload, options);
            return paymentFactory(data);
        } catch (error) {
            throw errorFactory(error);
        }
    }

    /**
     * Get payment by id
     * @see 'https://yookassa.ru/developers/api#get_payment'
     * @param {string} paymentId
     * @paramExample '215d8da0-000f-50be-b000-0003308c89be'
     * @returns {Promise<Payment>}
     */
    public async getPayment(paymentId: string): Promise<Payment> {
        try {
            const options = { auth: this.authData() };
            const { data } = await axios.get(`${this.root}/payments/${paymentId}`, options);
            return paymentFactory(data);
        } catch (error) {
            throw errorFactory(error);
        }
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
    public async capturePayment(paymentId: string, payload: ICapturePayment, idempotenceKey: string = uuid()): Promise<Payment> {
        try {
            const options = { auth: this.authData(), headers: { 'Idempotence-Key': idempotenceKey } };
            const { data } = await axios.post(`${this.root}/payments/${paymentId}/capture`, payload, options);
            return paymentFactory(data);
        } catch (error) {
            throw errorFactory(error);
        }
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
    public async cancelPayment(paymentId: string, idempotenceKey: string = uuid()): Promise<Payment> {
        try {
            const options = { auth: this.authData(), headers: { 'Idempotence-Key': idempotenceKey } };
            const { data } = await axios.post(`${this.root}/payments/${paymentId}/cancel`, {}, options);
            return paymentFactory(data);
        } catch (error) {
            throw errorFactory(error);
        }
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
    public async getPaymentList(filters: IGetPaymentList = {}): Promise<IPaymentList> {
        const f = this.normalizeFilter(filters);
        try {
            const options = { auth: this.authData() };
            const { data } = await axios.get(`${this.root}/payments${this.buildQuery(f)}`, options);
            data.items = data.items.map((i: any) => paymentFactory(i));
            return data;
        } catch (error) {
            throw errorFactory(error);
        }
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
    public async createRefund(payload: ICreateRefund, idempotenceKey: string = uuid()): Promise<Refund> {
        try {
            const options = { auth: this.authData(), headers: { 'Idempotence-Key': idempotenceKey } };
            const { data } = await axios.post(`${this.root}/refunds`, payload, options);
            return refundFactory(data);
        } catch (error) {
            throw errorFactory(error);
        }
    }

    /**
     * Get refund by id
     * @see 'https://yookassa.ru/developers/api#get_refund'
     * @param {string} refundId
     * @paramExample '216749f7-0016-50be-b000-078d43a63ae4'
     * @returns {Promise<Refund>}
     */
    public async getRefund(refundId: string): Promise<Refund> {
        try {
            const options = { auth: this.authData() };
            const { data } = await axios.get(`${this.root}/refunds/${refundId}`, options);
            return refundFactory(data);
        } catch (error) {
            throw errorFactory(error);
        }
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
    public async getRefundList(filters: IGetRefundList = {}): Promise<IRefundList> {
        const f = this.normalizeFilter(filters);
        try {
            const options = { auth: this.authData() };
            const { data } = await axios.get(`${this.root}/refunds${this.buildQuery(f)}`, options);
            data.items = data.items.map((i: any) => paymentFactory(i));
            return data;
        } catch (error) {
            throw errorFactory(error);
        }
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
    public async createReceipt(payload: ICreateReceipt, idempotenceKey: string = uuid()): Promise<Receipt> {
        try {
            const options = { auth: this.authData(), headers: { 'Idempotence-Key': idempotenceKey } };
            const { data } = await axios.post(`${this.root}/receipts`, payload, options);
            return receiptFactory(data);
        } catch (error) {
            throw errorFactory(error);
        }
    }

    /**
     * Get receipt by id
     * @see 'https://yookassa.ru/developers/api#get_receipt'
     * @param {string} receiptId
     * @paramExample '216749f7-0016-50be-b000-078d43a63ae4'
     * @returns {Promise<Receipt>}
     */
    public async getReceipt(receiptId: string): Promise<Receipt> {
        try {
            const options = { auth: this.authData() };
            const { data } = await axios.get(`${this.root}/receipts/${receiptId}`, options);
            return receiptFactory(data);
        } catch (error) {
            throw errorFactory(error);
        }
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
    public async getReceiptList(filters: IGetReceiptList = {}): Promise<IReceiptList> {
        const f = this.normalizeFilter(filters);
        try {
            const options = { auth: this.authData() };
            const { data } = await axios.get(`${this.root}/receipts${this.buildQuery(f)}`, options);
            data.items = data.items.map((i: any) => receiptFactory(i));
            return data;
        } catch (error) {
            throw errorFactory(error);
        }
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
    public async createWebHook(payload: ICreateWebHook, idempotenceKey: string = uuid()): Promise<WebHook> {
        try {
            if (!this.options.token) {
                throw errorFactory({
                    id: uuid(),
                    code: 'Internal error',
                    errorCode: 500,
                    description: 'Web hook functionality is only available with an OAuth token',
                    parameter: 'Authorization',
                    type: 'Internal'
                });
            }
            const options = { headers: { 'Idempotence-Key': idempotenceKey, 'Authorization': `Bearer ${this.options.token}` } };
            const { data } = await axios.post(`${this.root}/webhooks`, payload, options);
            return webhookFactory(data);
        } catch (error) {
            if(error instanceof ErrorResponse) {
                throw error;
            }
            throw errorFactory(error);
        }
    }

    /**
     * Get webhook list
     * @see 'https://yookassa.ru/developers/api#get_webhook_list'
     * @returns {Promise<Object>}
     */
    public async getWebHookList(): Promise<IWebHookList> {
        try {
            if (!this.options.token) {
                throw errorFactory({
                    id: uuid(),
                    code: 'Internal error',
                    errorCode: 500,
                    description: 'Web hook functionality is only available with an OAuth token',
                    parameter: 'Authorization',
                    type: 'Internal'
                });
            }
            const options = { headers: { 'Authorization': `Bearer ${this.options.token}` } };
            const { data } = await axios.get(`${this.root}/webhooks`, options);
            data.items = data.items.map((i: any) => webhookFactory(i));
            return data;
        } catch (error) {
            if(error instanceof ErrorResponse) {
                throw error;
            }
            throw errorFactory(error);
        }
    }
    /**
     * Delete webhook
     * @see 'https://yookassa.ru/developers/api#delete_webhook
     * @param {string} id
     * @paramExample
     * wh-edba6d49-ce3e-4d99-991b-4bb164859dc3
     * @returns {Promise<Object>}
     */
    public async deleteWebHook(id: string): Promise<{}> {
        try {
            if (!this.options.token) {
                throw errorFactory({
                    id: uuid(),
                    code: 'Internal error',
                    errorCode: 500,
                    description: 'Web hook functionality is only available with an OAuth token',
                    parameter: 'Authorization',
                    type: 'Internal'
                });
            }
            const options = { headers: { 'Authorization': `Bearer ${this.options.token}` } };
            await axios.delete(`${this.root}/webhooks/${id}`, options);
            return {};
        } catch (error) {
            if(error instanceof ErrorResponse) {
                throw error;
            }
            throw errorFactory(error);
        }
    }
    /**
     * Get shop info
     * @see 'https://yookassa.ru/developers/api#get_me'
     * @returns {Promise<Object>}
     */
    public async getShop(): Promise<Me> {
        try {
            if (!this.options.token) {
                throw errorFactory({
                    id: uuid(),
                    code: 'Internal error',
                    errorCode: 500,
                    description: 'Shop information is only available with an OAuth token',
                    parameter: 'Authorization',
                    type: 'Internal'
                });
            }
            const options = { headers: { 'Authorization': `Bearer ${this.options.token}` } };
            const { data } = await axios.get(`${this.root}/me`, options);
            return meFactory(data);
        } catch (error) {
            if(error instanceof ErrorResponse) {
                throw error;
            }
            throw errorFactory(error);
        }
    }

}