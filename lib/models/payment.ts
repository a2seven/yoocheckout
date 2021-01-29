import {
    IAmount,
    IPaymentMethodType,
    IPaymentMethodData,
    IPaymentStatus,
    IReceiptStatus,
    IVatData,
    IAirline,
    ITransfer,
    IConfirmation,
    IReceipt,
    IRecipient
} from "../types";

export class Payment {
    id!: string;
    status!: IPaymentStatus;
    paid!: boolean;
    amount!: IAmount;
    income_amount!: IAmount;
    refunded_amount!: IAmount;
    created_at!: string;
    description!: string;
    expires_at!: string;
    captured_at!: string;
    metadata!: any;
    payment_token!: string;
    payment_method_id!: string;
    payment_method_data!: IPaymentMethodData;
    payment_method!: {
        type: IPaymentMethodType;
        id: string;
        saved: boolean;
        card?: {
            first6: string;
            last4: string;
            expiry_month: string;
            expiry_year: string;
            card_type: string;
            issuer_country?: string;
            issuer_name?: string;
            source?: string;
        };
        title?: string;
        login?: string;
        payer_bank_details?: {
            full_name: string;
            short_name: string;
            address: string;
            inn: string;
            kpp: string;
            bank_name: string;
            bank_branch: string;
            bank_bik: string;
            account: string;
        };
        payment_purpose?: string;
        vat_data?: IVatData;
        phone?: string;
        account_number?: string;
    };
    recipient!: IRecipient;
    confirmation!: IConfirmation;
    save_payment_method!: boolean;
    capture!: boolean;
    client_ip!: string;
    airline!: IAirline;
    refundable!: boolean;
    test!: boolean;
    receipt_registration!: IReceiptStatus;
    cancellation_details!: {
        party: string;
        reason: string;
    };
    authorization_details!: {
        auth_code: string;
        rrn: string;
    };
    transfers!: ITransfer[];
    receipt!: IReceipt;
    constructor() {
    }

}

export const paymentFactory = (payload: any): Payment => {
    return Object.assign(new Payment(), payload);
};


