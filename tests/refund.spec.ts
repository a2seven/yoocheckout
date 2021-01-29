import 'mocha';
import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

import { YooCheckout } from '../lib/core/yoo-checkout.core';
import { Refund, refundFactory } from '../lib/models';
import {
    createAndGetRefundResponse,
    createRefundData,
    getRefundListResponse
} from './test.data';
import { IRefundList } from '../lib/types';
import { apiUrl } from '../lib/core';

const instance = new YooCheckout({ shopId: 'your_shop_id', secretKey: 'your_secret_key' });
const mockHost = `${apiUrl}/refunds`;

describe('Test Refund functionality', () => {
    describe('Tests for creating refund', () => {
        let mockHttp: MockAdapter;

        before(() => {
            mockHttp = new MockAdapter(axios);
            mockHttp.onPost(mockHost, createRefundData).reply(200, createAndGetRefundResponse);
        });

        after(() => {
            mockHttp.restore();
        });


        describe('Creating refund', () => {
            it('should success create new refund', done => {
                instance.createRefund(createRefundData, uuid()).then((data: Refund) => {
                    expect(data).to.be.an('object');
                    expect(data).to.have.property('id');
                    expect(data).to.have.property('status');
                    expect(data).to.have.property('amount');
                    expect(data.status).to.equal('succeeded');
                    expect(data).to.have.property('payment_id');
                    done();
                });
            });
        });
    });

    describe('Tests for get information about refund', () => {
        let mockHttp: MockAdapter;
        let id = uuid();
        before(() => {
            mockHttp = new MockAdapter(axios);
            mockHttp.onGet(`${mockHost}/${id}`).reply(200, createAndGetRefundResponse);
        });

        after(() => {
            mockHttp.restore();
        });

        describe('Get info about refund', () => {
            it('should return information about refund', done => {
                instance.getRefund(id).then((data: Refund) => {
                    expect(data).to.be.an('object');
                    expect(data).to.have.property('id');
                    expect(data).to.have.property('amount');
                    expect(data).to.have.property('status');
                    expect(data).to.have.property('payment_id');
                    done();
                });
            });
        });
    });

    describe('Tests for get refund list', () => {
        let mockHttp: MockAdapter;
        before(() => {
            mockHttp = new MockAdapter(axios);
            mockHttp.onGet(mockHost).reply(200, getRefundListResponse);
        });

        after(() => {
            mockHttp.restore();
        });

        describe('Get refund list', () => {
            it('should return refund list', done => {
                instance.getRefundList({}).then((data: IRefundList) => {
                    expect(data).to.be.an('object');
                    expect(data).to.have.property('type');
                    expect(data).to.have.property('items');
                    expect(data).to.have.property('next_cursor');
                    expect(data.items).to.have.length(1);
                    expect(data.items).to.deep.include(refundFactory(getRefundListResponse.items[0]));
                    done();
                });
            });
        });
    });
});