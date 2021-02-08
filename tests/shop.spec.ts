import 'mocha';
import { expect } from 'chai';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { YooCheckout } from '../lib/core/yoo-checkout.core';
import { Me } from '../lib/models';
import { getShopInfoResponse } from './test.data';
import { apiUrl } from '../lib/core';

const instance = new YooCheckout({ shopId: 'your_shop_id', secretKey: 'your_secret_key', token: 'token' });
const mockHost = `${apiUrl}/me`;

describe('Test Me(Shop) functionality', () => {
    describe('Tests for get information about shop', () => {
        let mockHttp: MockAdapter;

        before(() => {
            mockHttp = new MockAdapter(axios);
            mockHttp.onGet(mockHost).reply(200, getShopInfoResponse);
        });

        after(() => {
            mockHttp.restore();
        });


        describe('Get info about shop', () => {
            it('should return information about shop', done => {
                instance.getShop().then((data: Me) => {
                    expect(data).to.be.an('object');
                    expect(data).to.have.property('account_id');
                    expect(data).to.have.property('test');
                    expect(data).to.have.property('fiscalization_enabled');
                    expect(data).to.have.property('payment_methods');
                    expect(data).to.have.property('status');
                    done();
                });
            });
        });
    });
});