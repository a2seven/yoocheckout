# Yoo.Checkout API SDK (unofficial)

[![A@SEVEN](https://i.ibb.co/my3rNCm/logo1.png)](https://a2seven.com/)
[![npm version](https://img.shields.io/npm/v/@a2seven/yoo-checkout.svg)](npmjs.com/package/@a2seven/yoo-checkout)
[![license](https://img.shields.io/npm/l/@a2seven/yoo-checkout.svg)](npmjs.com/package/@a2seven/yoo-checkout)
[![npm version](https://img.shields.io/badge/Support%20us-A2Seven-41B883.svg)](https://a2seven.com/)
[README](README.ru.md) на русском!

[Yoo.Checkout](https://yookassa.ru/) - a universal solution for working with online payments. The Yoo.Checkout API is built on REST-principles, works with real objects and has predictable behavior. Using this API, you can send payment requests, save payment information for repeated charges (and include auto payments), make refunds and much more.
The API uses HTTP as the main protocol, which means it is suitable for development in any programming language that can work with HTTP libraries (for example, cURL). Authentication uses Basic Auth, so you can make your first request directly from the browser.
The API supports POST and GET requests. POST requests use JSON arguments, GET requests work with query strings. The API always returns a response in JSON format, regardless of the type of request.

## Authentication

To authenticate requests you need to use HTTP Basic Auth. In the headers of the requests as a user name you need to pass the ID of your store in YooKassa, as a password - your secret key (it must be generated and activated by the password from the sms)

Example request with authentication
```bash
curl https://api.yookassa.ru/v3/payments/{payment_id} \
  -u <shopId>:<secretKey>
```

## Idempotency
In API context, idempotency means that multiple requests are handled the same way as a single request.
It means that if you receive a repeated request with the same parameters, you will get the result of the original request in your response.
This behavior helps to avoid undesirable repetition of transactions. For example, if there is a problem with the network and the connection is broken while making a payment, you can safely repeat the request as many times as you want.
GET requests are idempotent by default because they have no undesirable consequences.
The Idempotence-Key header (or idempotence key) is used to ensure the idempotency of POST requests.

Example of a query with an idempotent key
```bash
curl https://api.yookassa.ru/v3/refunds \
  -X POST \
  -u <shopId>:<secretKey> \
  -H 'Idempotence-Key: <Idempotency key>' \
  -H 'Content-Type: application/json' \
  -d '{
        "amount": {
          "value": "2.00",
          "currency": "RUB"
        },
        "payment_id": "215d8da0-000f-50be-b000-0003308c89be"
      }'
```
If you repeat a request with the same data and the same key, the API processes it as a repeat request. If the data in the request is the same and the idempotence key is different, the request is executed as a new one.
You can pass any value unique to that operation on your side in the Idempotence-Key header. We recommend using a V4 UUID.
YooKassa provides idempotence for 24 hours after the first request, then a second request will be processed as a new one.

## Synchronicity
YooKassa processes the received request immediately and returns the result of processing ("success" or "failure").
If an exact response cannot be given within 30 seconds, e.g. due to a problem on the acquirer's side, YooKassa will return HTTP code 500 and try to cancel the operation.
To find out the final result of the request, repeat the request with the same data and the same idempotent key. The recommended frequency of repetitions is once per minute, until YooKassa reports a response other than HTTP 500.

## HTTP response codes
If the request is processed successfully, the API will return the HTTP code 200 and the response body.
If an error occurs during processing, API will return the error object and standard HTTP code.

| HTTP CODE | ERROR CODE | DESCRIPTION |
| ------ | ------ | ------ |
| 400 | invalid_request, not_supported | Incorrect request. Most often this status is issued due to a violation of the rules of interaction with the API. | 
| 401 | invalid_credentials | [Basic Auth] Your YooKassa account ID or secret key (authentication username and password) is invalid. [OAuth 2.0] Invalid OAuth token: it is invalid, out of date, or has been revoked. Request the token again. |
| 403 | forbidden | The secret key or OAuth token is correct, but lacks permissions to complete the transaction. |
| 404 | not_found | Resource not found. | 
| 429 | too_many_requests | The limit of requests per time unit has been exceeded. Try reducing the intensity of the requests. | 
| 500 | internal_server_error | Technical problems on the side of YooKasa. The result of the request processing is unknown. Repeat the request later with the same idempotency key. It is recommended to repeat the request at intervals of once a minute until YooKassa reports the result of operation processing. |

Example error response body
```javascript
  {
    "type": "error",
    "id": "ab5a11cd-13cc-4e33-af8b-75a74e18dd09",
    "code": "invalid_request",
    "description": "Idempotence key duplicated",
    "parameter": "Idempotence-Key"
  }
```
SDK Error Response
```javascript
ErrorResponse {
    "type": "error",
    "id": "ab5a11cd-13cc-4e33-af8b-75a74e18dd09",
    "code": "invalid_request",
    "description": "Idempotence key duplicated",
    "parameter": "Idempotence-Key"
    "errorCode": 401
}
```
## Reference
[YooKassa API page](https://yookassa.ru/developers/api#intro)
## Installation
```bash
npm install @a2seven/yoo-checkout
```
## Getting started
 
```javascript
import { YooCheckout } from '@a2seven/yoo-checkout'; // OR const { YooCheckout } = require('@a2seven/yoo-checkout');

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey' });
```

## Docs
### [Create payment](https://yookassa.ru/developers/api#create_payment)

```javascript
import { YooCheckout, ICreatePayment  } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey' });

const idempotenceKey = '02347fc4-a1f0-49db-807e-f0d67c2ed5a5';

const createPayload: ICreatePayment = {
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

try {
    const payment = await checkout.createPayment(createPayload, idempotenceKey);
    console.log(payment)
} catch (error) {
     console.error(error);
}
```
### [Get payment](https://yookassa.ru/developers/api#get_payment)

```javascript
import { YooCheckout } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey' });

const paymentId = '21966b95-000f-50bf-b000-0d78983bb5bc';

try {
    const payment = await checkout.getPayment(paymentId);
    console.log(payment)
} catch (error) {
     console.error(error);
}
```
### [Capture payment](https://yookassa.ru/developers/api#capture_payment)
```javascript
import { YooCheckout, ICapturePayment } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey' });

const paymentId = '21966b95-000f-50bf-b000-0d78983bb5bc';

const idempotenceKey = '02347fc4-a1f0-49db-807e-f0d67c2ed5a5';

const capturePayload: ICapturePayment = {
    amount: {
        value: '2.00',
        currency: 'RUB'
    }
};

try {
    const payment = await checkout.capturePayment(paymentId, capturePayload, idempotenceKey);
    console.log(payment)
} catch (error) {
     console.error(error);
}
```
 
### [Cancel payment](https://yookassa.ru/developers/api#cancel_payment)
```javascript
import { YooCheckout } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey' });

const paymentId = '21966b95-000f-50bf-b000-0d78983bb5bc';

const idempotenceKey = '02347fc4-a1f0-49db-807e-f0d67c2ed5a5';

try {
    const payment = await checkout.cancelPayment(paymentId, idempotenceKey);
    console.log(payment)
} catch (error) {
     console.error(error);
}
```
### [Get payment list](https://yookassa.ru/developers/api#get_payments_list)
```javascript
import { YooCheckout, IGetPaymentList } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey' });

const filters: IGetPaymentList = { created_at: { value: '2021-01-27T13:58:02.977Z', mode: 'gte' },  limit: 20 };

try {
    const paymentList = await checkout.getPaymentList(filters);
    console.log(paymentList)
} catch (error) {
     console.error(error);
}
```
### [Create refund](https://yookassa.ru/developers/api#create_refund)
```javascript
import { YooCheckout, ICreateRefund } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey' });

const idempotenceKey = '02347fc4-a1f0-49db-807e-f0d67c2ed5a5';

const createRefundPayload: ICreateRefund = {
    payment_id: '27a3852a-000f-5000-8000-102d922df8db',
    amount: {
        value: '1.00',
        currency: 'RUB'
    }
};

try {
    const refund = await checkout.createRefund(createRefundPayload, idempotenceKey);
    console.log(refund)
} catch (error) {
     console.error(error);
}
```

### [Get refund](https://yookassa.ru/developers/api#get_refund)
```javascript
import { YooCheckout } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey' });

const refundId = '21966b95-000f-50bf-b000-0d78983bb5bc';

try {
    const refund = await checkout.getRefund(refundId);
    console.log(refund)
} catch (error) {
     console.error(error);
}
```

### [Get refund list](https://yookassa.ru/developers/api#get_refunds_list)
```javascript
import { YooCheckout, IGetRefundList } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey' });

const filters: IGetRefundList = { created_at: { value: '2021-01-27T13:58:02.977Z', mode: 'gte' },  limit: 20 };

try {
    const refundList = await checkout.getRefundList(filters);
    console.log(refundList)
} catch (error) {
     console.error(error);
}
```

### [Create receipt](https://yookassa.ru/developers/api#create_receipt)
```javascript
import { YooCheckout, ICreateReceipt } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey' });

const idempotenceKey = '02347fc4-a1f0-49db-807e-f0d67c2ed5a5';

const createReceiptPayload: ICreateReceipt = {
    send: true,
    customer: {
        email: 'test@gmail.com'
    },
    settlements: [
        {
            type: 'cashless',
            amount: {
                value: '2.00',
                currency: 'RUB'
            }
        }
    ],
    refund_id: '27a387af-0015-5000-8000-137da144ce29',
    type: 'refund',
    items: [
        {
            description: 'test',
            quantity: '2',
            amount: {
                value: '1.00',
                currency: 'RUB'
            },
            vat_code: 1,
        }
    ]
};

try {
    const receipt = await checkout.createReceipt(createReceiptPayload, idempotenceKey);
    console.log(receipt)
} catch (error) {
     console.error(error);
}
```

### [Get receipt](https://yookassa.ru/developers/api#get_receipt)
```javascript
import { YooCheckout } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey' });

const receiptId = '21966b95-000f-50bf-b000-0d78983bb5bc';

try {
    const receipt = await checkout.getReceipt(receiptId);
    console.log(receipt)
} catch (error) {
     console.error(error);
}
```

### [Get receipt list](https://yookassa.ru/developers/api#get_receipts_list)
```javascript
import { YooCheckout, IGetReceiptList } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey' });

const filters: IGetReceiptList = { created_at: { value: '2021-01-27T13:58:02.977Z', mode: 'gte' },  limit: 20 };

try {
    const receiptList = await checkout.getReceiptList(filters);
    console.log(receiptList)
} catch (error) {
     console.error(error);
}
```

#### The following functionality works only as part of an [affiliate program](https://yookassa.ru/developers/partners-api/basics)

### [Create webhook](https://yookassa.ru/developers/api#create_webhook)
```javascript
import { YooCheckout, ICreateWebHook } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey', token: 'your_OAuth_token' });

const idempotenceKey = '02347fc4-a1f0-49db-807e-f0d67c2ed5a5';
const createWebHookPayload: ICreateWebHook = {
    event: 'payment.canceled',
    url: 'https://test.com/hook'
};

try {
    const webhook = await checkout.createWebHook(createWebHookPayload, idempotenceKey);
    console.log(webhook)
} catch (error) {
     console.error(error);
}
```

### [Get webhook list](https://yookassa.ru/developers/api#get_webhook_list)
```javascript
import { YooCheckout } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey', token: 'your_OAuth_token' });
try {
    const webHookList = await checkout.getWebHookList();
    console.log(webHookList)
} catch (error) {
     console.error(error);
}
```

### [Delete webhook](https://yookassa.ru/developers/api#delete_webhook)
```javascript
import { YooCheckout, ICreateWebHook } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey', token: 'your_OAuth_token' });

const webHookId = 'wh-edba6d49-ce3e-4d99-991b-4bb164859dc3';

try {
    await checkout.deleteWebHook(webHookId);
} catch (error) {
     console.error(error);
}
```

### [Get shop info](https://yookassa.ru/developers/api#get_me)
```javascript
import { YooCheckout, ICreateWebHook } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey', token: 'your_OAuth_token' });

try {
   const shop = await checkout.getShop();
   console.log(shop)
} catch (error) {
     console.error(error);
}
```

## Running Tests

To install the development dependencies (run where the package.json is):
```bash
$ npm install
```

Run the tests:
```bash
$ npm run test:unit
```