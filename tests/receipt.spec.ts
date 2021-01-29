import 'mocha';
import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

import { YooCheckout } from '../lib/core/yoo-checkout.core';
import { Receipt, receiptFactory } from '../lib/models';
import {
    createReceiptData,
    createReceiptResponse,
    getReceiptListResponse,
    getReceiptResponse
} from './test.data';
import { IReceiptList } from '../lib/types';
import { apiUrl } from '../lib/core';

const instance = new YooCheckout({ shopId: 'your_shop_id', secretKey: 'your_secret_key' });
const mockHost = `${apiUrl}/receipts`;

describe('Test Receipt functionality', () => {
    describe('Tests for creating receipt', () => {
        let mockHttp: MockAdapter;

        before(() => {
            mockHttp = new MockAdapter(axios);
            mockHttp.onPost(mockHost, createReceiptData).reply(200, createReceiptResponse);
        });

        after(() => {
            mockHttp.restore();
        });


        describe('Creating receipt', () => {
            it('should success create new receipt', done => {
                instance.createReceipt(createReceiptData, uuid()).then((data: Receipt) => {
                    expect(data).to.be.an('object');
                    expect(data).to.have.property('id');
                    expect(data).to.have.property('refund_id');
                    expect(data).to.have.property('type');
                    expect(data).to.have.property('status');
                    expect(data).to.have.property('items');
                    expect(data).to.have.property('settlements');
                    expect(data).to.have.property('tax_system_code');
                    expect(data.status).to.equal('succeeded');
                    expect(data.items).to.have.length(createReceiptData.items.length);
                    expect(data.settlements).to.have.length(createReceiptData.settlements.length);
                    expect(data.tax_system_code).to.equal(1);
                    expect(data.refund_id).to.equal(createReceiptData.refund_id);
                    expect(data.type).to.equal(createReceiptResponse.type);

                    done();
                });
            });
        });
    });

    describe('Tests for get information about receipt', () => {
        let mockHttp: MockAdapter;
        let id = uuid();
        before(() => {
            mockHttp = new MockAdapter(axios);
            mockHttp.onGet(`${mockHost}/${id}`).reply(200, getReceiptResponse);
        });

        after(() => {
            mockHttp.restore();
        });

        describe('Get info about receipt', () => {
            it('should return information about receipt', done => {
                instance.getReceipt(id).then((data: Receipt) => {
                    expect(data).to.be.an('object');
                    expect(data).to.have.property('id');
                    expect(data).to.have.property('type');
                    expect(data).to.have.property('status');
                    expect(data).to.have.property('payment_id');
                    expect(data).to.have.property('fiscal_document_number');
                    expect(data).to.have.property('fiscal_storage_number');
                    expect(data).to.have.property('fiscal_attribute');
                    expect(data).to.have.property('registered_at');
                    expect(data).to.have.property('fiscal_provider_id');
                    expect(data).to.have.property('items');
                    expect(data).to.have.property('tax_system_code');
                    expect(data).to.have.property('settlements');
                    done();
                });
            });
        });
    });

    describe('Tests for get receipt list', () => {
        let mockHttp: MockAdapter;
        before(() => {
            mockHttp = new MockAdapter(axios);
            mockHttp.onGet(mockHost).reply(200, getReceiptListResponse);
        });

        after(() => {
            mockHttp.restore();
        });

        describe('Get receipt list', () => {
            it('should return receipt list', done => {
                instance.getReceiptList({}).then((data: IReceiptList) => {
                    expect(data).to.be.an('object');
                    expect(data).to.have.property('type');
                    expect(data).to.have.property('items');
                    expect(data).to.have.property('next_cursor');
                    expect(data.items).to.have.length(1);
                    expect(data.items).to.deep.include(receiptFactory(getReceiptListResponse.items[0]));
                    done();
                });
            });
        });
    });
});