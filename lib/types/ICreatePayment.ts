import {
    IAirlineWithoutId,
    IAmount,
    IConfirmationWithoutData,
    IPaymentDeal,
    IPaymentMethodData,
    IReceipt,
    IRecipientWithoutId,
    ITransferWithoutStatus,
} from '.';

export interface ICreatePayment {
    amount: IAmount;
    description?: string;
    receipt?: IReceipt;
    recipient?: IRecipientWithoutId;
    payment_token?: string;
    payment_method_id?: string;
    payment_method_data?: IPaymentMethodData;
    confirmation?: IConfirmationWithoutData;
    save_payment_method?: boolean;
    capture?: boolean;
    client_ip?: string;
    metadata?: any;
    airline?: IAirlineWithoutId;
    transfers?: ITransferWithoutStatus[];
    deal?: IPaymentDeal;
}
