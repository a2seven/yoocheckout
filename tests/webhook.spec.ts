import 'mocha';
import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

import { YooCheckout } from '../lib/core/yoo-checkout.core';
import { WebHook, webhookFactory } from '../lib/models';
import {
    createWebHookData,
    createWebHookResponse,
    getWebhookListResponse
} from './test.data';
import { IWebHookList } from '../lib/types';
import { apiUrl } from '../lib/core';

const instance = new YooCheckout({ shopId: 'your_shop_id', secretKey: 'your_secret_key', token: 'token' });
const mockHost = `${apiUrl}/webhooks`;

describe('Test Webhook functionality', () => {
    describe('Tests for creating webhook', () => {
        let mockHttp: MockAdapter;

        before(() => {
            mockHttp = new MockAdapter(axios);
            mockHttp.onPost(mockHost, createWebHookData).reply(200, createWebHookResponse);
        });

        after(() => {
            mockHttp.restore();
        });


        describe('Creating webhook', () => {
            it('should success create new webhook', done => {
                instance.createWebHook(createWebHookData, uuid()).then((data: WebHook) => {
                    expect(data).to.be.an('object');
                    expect(data).to.have.property('id');
                    expect(data).to.have.property('event');
                    expect(data).to.have.property('url');
                    expect(data.event).to.equal(createWebHookData.event);
                    done();
                });
            });
        });
    });

    describe('Tests for get webhook list', () => {
        let mockHttp: MockAdapter;
        before(() => {
            mockHttp = new MockAdapter(axios);
            mockHttp.onGet(mockHost).reply(200, getWebhookListResponse);
        });

        after(() => {
            mockHttp.restore();
        });

        describe('Get webhook list', () => {
            it('should return webhook list', done => {
                instance.getWebHookList().then((data: IWebHookList) => {
                    expect(data).to.be.an('object');
                    expect(data).to.have.property('type');
                    expect(data).to.have.property('items');
                    expect(data).to.have.property('next_cursor');
                    expect(data.items).to.have.length(1);
                    expect(data.items).to.deep.include(webhookFactory(getWebhookListResponse.items[0]));
                    done();
                });
            });
        });
    });
});