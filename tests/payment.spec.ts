import 'mocha';
import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

import { YooCheckout } from '../lib/core/yoo-checkout.core';
import { Payment, paymentFactory } from '../lib/models';
import {
    cancelPaymentResponse,
    capturePaymentResponse,
    createPaymentData,
    createPaymentResponse,
    getPaymentListResponse,
    getPaymentResponse
} from './test.data';
import { IPaymentList } from '../lib/types';
import { apiUrl } from '../lib/core';

const instance = new YooCheckout({ shopId: 'your_shop_id', secretKey: 'your_secret_key' });
const mockHost = `${apiUrl}/payments`;

describe('Test Payment functionality', () => {
    describe('Tests for creating payment', () => {
        let mockHttp: MockAdapter;

        before(() => {
            mockHttp = new MockAdapter(axios);
            mockHttp.onPost(mockHost, createPaymentData).reply(200, createPaymentResponse);
        });

        after(() => {
            mockHttp.restore();
        });


        describe('Creating payment', () => {
            it('should success create new payment', done => {
                instance.createPayment(createPaymentData, uuid()).then((data: Payment) => {
                    expect(data).to.be.an('object');
                    expect(data).to.have.property('id');
                    expect(data).to.have.property('status');
                    expect(data).to.have.property('payment_method');
                    expect(data).to.have.property('recipient');
                    done();
                });
            });
        });
    });

    describe('Tests for get information about payment', () => {
        let mockHttp: MockAdapter;
        let id = uuid();
        before(() => {
            mockHttp = new MockAdapter(axios);
            mockHttp.onGet(`${mockHost}/${id}`).reply(200, getPaymentResponse);
        });

        after(() => {
            mockHttp.restore();
        });

        describe('Get info about payment by id', () => {
            it('should return information about payment', done => {
                instance.getPayment(id).then((data: Payment) => {
                    expect(data).to.be.an('object');
                    expect(data).to.have.property('id');
                    expect(data).to.have.property('status');
                    expect(data).to.have.property('paid');
                    expect(data).to.have.property('payment_method');
                    expect(data).to.have.property('recipient');
                    done();
                });
            });
        });
    });

    describe('Tests for payment confirm', () => {
        let mockHttp: MockAdapter;
        let id = uuid();
        before(() => {
            mockHttp = new MockAdapter(axios);
            mockHttp.onPost(`${mockHost}/${id}/capture`).reply(200, capturePaymentResponse);
        });

        after(() => {
            mockHttp.restore();
        });

        describe('Confirmation payment', () => {
            it('should return information about success confirmed payment', done => {
                instance.capturePayment(id, createPaymentResponse).then((data: Payment) => {
                    expect(data).to.be.an('object');
                    expect(data).to.have.property('id');
                    expect(data).to.have.property('status');
                    expect(data).to.have.property('paid');
                    expect(data.paid).to.equal(true);
                    expect(data).to.have.property('payment_method');
                    expect(data).to.have.property('recipient');
                    done();
                });
            });
        });
    });

    describe('Tests for cancel payment', () => {
        let mockHttp: MockAdapter;
        let id = uuid();
        before(() => {
            mockHttp = new MockAdapter(axios);
            mockHttp.onPost(`${mockHost}/${id}/cancel`).reply(200, cancelPaymentResponse);
        });

        after(() => {
            mockHttp.restore();
        });

        describe('Cancel payment', () => {
            it('should return information about canceled payment', done => {
                instance.cancelPayment(id).then((data: Payment) => {
                    expect(data).to.be.an('object');
                    expect(data).to.have.property('id');
                    expect(data).to.have.property('status');
                    expect(data).to.have.property('paid');
                    expect(data.status).to.equal('canceled');
                    expect(data).to.have.property('payment_method');
                    expect(data).to.have.property('recipient');
                    done();
                });
            });
        });
    });

    describe('Tests for get payment list', () => {
        let mockHttp: MockAdapter;
        before(() => {
            mockHttp = new MockAdapter(axios);
            mockHttp.onGet(mockHost).reply(200, getPaymentListResponse);
        });

        after(() => {
            mockHttp.restore();
        });

        describe('Get payment list', () => {
            it('should return payment list', done => {
                instance.getPaymentList({}).then((data: IPaymentList) => {
                    expect(data).to.be.an('object');
                    expect(data).to.have.property('type');
                    expect(data).to.have.property('items');
                    expect(data).to.have.property('next_cursor');
                    expect(data.items).to.have.length(1);
                    expect(data.items).to.deep.include(paymentFactory(getPaymentListResponse.items[0]));
                    done();
                });
            });
        });
    });
});