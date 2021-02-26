# Yoo.Checkout API SDK (неофициальная)

[![A@SEVEN](https://i.ibb.co/my3rNCm/logo1.png)](https://a2seven.com/)
[![npm version](https://img.shields.io/npm/v/@a2seven/yoo-checkout.svg)](npmjs.com/package/@a2seven/yoo-checkout)
[![license](https://img.shields.io/npm/l/@a2seven/yoo-checkout.svg)](npmjs.com/package/@a2seven/yoo-checkout)
[![npm version](https://img.shields.io/badge/Support%20us-A2Seven-41B883.svg)](https://a2seven.com/)

[README](README.md) in English

[Yoo.Checkout](https://yookassa.ru/) - универсальное решение для работы с онлайн-платежами. API ЮKassa построено на REST-принципах, работает с реальными объектами и обладает предсказуемым поведением. С помощью этого API вы можете отправлять запросы на оплату, сохранять платежную информацию для повторных списаний, совершать возвраты и многое другое.

API в качестве основного протокола использует HTTP, а значит, подходит для разработки на любом языке программирования, который умеет работать с HTTP-библиотеками (cURL и другими).

API поддерживает POST и GET-запросы. POST-запросы используют JSON-аргументы, GET-запросы работают со строками запросов. API всегда возвращает ответ в формате JSON, независимо от типа запроса.

## Аутентификация

Для аутентификации запросов необходимо использовать HTTP Basic Auth. В заголовках запросов в качестве имени пользователя необходимо передать идентификатор вашего магазина в ЮKassa, в качестве пароля — ваш секретный ключ (его нужно сгенерировать и активировать паролем из смс).

Пример запроса с аутентификацией
```bash
curl https://api.yookassa.ru/v3/payments/{payment_id} \
  -u <shopId>:<secretKey>
```

## Идемпотентность
В контексте API идемпотентность означает, что многократные запросы обрабатываются так же, как однократные.
Это значит, что получив повторный запрос с теми же параметрами, ЮKassa выдаст в ответе результат исходного запроса.
Такое поведение помогает избежать нежелательного повторения транзакций. Например, если при проведении платежа возникли проблемы с сетью, и соединение прервалось, вы сможете безопасно повторить нужный запрос неограниченное количество раз.
GET-запросы являются по умолчанию идемпотентными, так как не имеют нежелательных последствий.
Для обеспечения идемпотентности POST-запросов используется заголовок Idempotence-Key (или ключ идемпотентности).

Пример запроса с ключом идемпотентности
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
Если вы повторяете запрос с теми же данными и тем же ключом, API обрабатывает его как повторный. Если данные в запросе те же, а ключ идемпотентности отличается, запрос выполняется как новый.
В заголовке Idempotence-Key можно передавать любое значение, уникальное для этой операции на вашей стороне. Мы рекомендуем использовать V4 UUID.
ЮKassa обеспечивает идемпотентность в течение 24 часов после первого запроса, потом повторный запрос будет обработан как новый.

## Синхронность
ЮKassa обрабатывает полученный запрос немедленно и возвращает результат обработки («успех» или «неудача»).
Если в течение 30 секунд невозможно дать точный ответ, например из-за неполадок на стороне эквайера, ЮKassa вернет HTTP-код 500 и попытается отменить операцию.
Чтобы узнать окончательный результат обработки запроса, повторите запрос с теми же данными и с тем же ключом идемпотентности. Рекомендуемая частота повторений: один раз в минуту до тех пор, пока ЮKassa не сообщит ответ, отличный от HTTP 500.

## HTTP-коды ответов
Если запрос обработан успешно, API вернет HTTP-код 200 и тело ответа.
Если в процессе обработки произойдет ошибка, API вернет объект ошибки и стандартный HTTP-код.

| HTTP CODE | ERROR CODE | DESCRIPTION |
| ------ | ------ | ------ |
| 400 | invalid_request, not_supported | IНеправильный запрос. Чаще всего этот статус выдается из-за нарушения правил взаимодействия с API. | 
| 401 | invalid_credentials | [Basic Auth] Неверный идентификатор вашего аккаунта в ЮKassa или секретный ключ (имя пользователя и пароль при аутентификации). [OAuth 2.0] Невалидный OAuth-токен: он некорректный, устарел или его отозвали. Запросите токен заново. |
| 403 | forbidden | Секретный ключ или OAuth-токен верный, но не хватает прав для совершения операции. |
| 404 | not_found | Ресурс не найден. | 
| 429 | too_many_requests | Превышен лимит запросов в единицу времени. Попробуйте снизить интенсивность запросов. | 
| 500 | internal_server_error | Технические неполадки на стороне ЮKassa. Результат обработки запроса неизвестен. Повторите запрос позднее с тем же ключом идемпотентности. Рекомендуется повторять запрос с периодичностью один раз в минуту до тех пор, пока ЮKassa не сообщит результат обработки операции. |

Пример тела ответа ошибки
```json
  {
    "type": "error",
    "id": "ab5a11cd-13cc-4e33-af8b-75a74e18dd09",
    "code": "invalid_request",
    "description": "Idempotence key duplicated",
    "parameter": "Idempotence-Key"
  }
```
Пример объекта ошибки
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
## Ссылки
[YooKassa справочник API](https://yookassa.ru/developers/api#intro)
## Установка
```bash
npm install @a2seven/yoo-checkout
```
## Начало работы
 
```javascript
import { YooCheckout } from '@a2seven/yoo-checkout'; // или const { YooCheckout } = require('@a2seven/yoo-checkout');

const checkout = new YooCheckout({ shopId: 'your_shopId', secretKey: 'your_secretKey' });
```

## Документация
### [Создание платежа](https://yookassa.ru/developers/api#create_payment)

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
### [Информация о платеже](https://yookassa.ru/developers/api#get_payment)

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
### [Подтверждение платежа](https://yookassa.ru/developers/api#capture_payment)
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
 
### [Отмена платежа](https://yookassa.ru/developers/api#cancel_payment)
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
### [Список платежей](https://yookassa.ru/developers/api#get_payments_list)
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
### [Создание возврата](https://yookassa.ru/developers/api#create_refund)
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

### [Информация о возврате](https://yookassa.ru/developers/api#get_refund)
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

### [Список возвратов](https://yookassa.ru/developers/api#get_refunds_list)
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

### [Создание чека](https://yookassa.ru/developers/api#create_receipt)
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

### [Получить информацию о чеке](https://yookassa.ru/developers/api#get_receipt)
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

### [Список чеков](https://yookassa.ru/developers/api#get_receipts_list)
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

#### Следующий функционал работает только в рамках [партнерской программы](https://yookassa.ru/developers/partners-api/basics)

### [Создание веб-хука](https://yookassa.ru/developers/api#create_webhook)
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

### [Список веб-хуков](https://yookassa.ru/developers/api#get_webhook_list)
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

### [Удаление веб-хука](https://yookassa.ru/developers/api#delete_webhook)
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

### [Получить информацию о магазине](https://yookassa.ru/developers/api#get_me)
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

## Запуск тестов

Установите зависимости:
```bash
$ npm install
```

Запустите тесты:
```bash
$ npm run test:unit
```