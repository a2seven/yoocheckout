import { YooCheckout } from "./lib/core";

const you = new YooCheckout({ shopId: '783530', secretKey: 'test_PEOEcgbpW1yzK0xOOnHgXJXfGFNrMH6ts4h441eT6Tk', token: 'AAEACCWgAGj1egAAAXeBmIwgx4ycHpmDHZsc8QLhGhoDGpfHX-NC_vRMfIO6dqjN_MtkrCGTOiYWoEFOLzOy41wu' });


// you.createWebHook({event: 'payment.waiting_for_capture', url: 'https://188.68.220.149:3000/hook/'}).then(w => {console.log(w);});

you.getShop().then(l => {
    console.log(l);
    // you.deleteWebHook('wh-edba6d49-ce3e-4d99-991b-4bb164859dc3').then(w => {
    //     console.log(w);
    //     you.getWebHookList().then(l => {console.log(l);});
    // });
});

