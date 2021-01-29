import {
    ICheckoutCustomer,
    IItem,
    IReceiptType,
    ISettlement
} from ".";

export interface ICreateReceipt {
    type: IReceiptType;
    customer: ICheckoutCustomer;
    send: boolean;
    settlements: ISettlement[];
    payment_id?: string;
    refund_id?: string;
    items: IItem[];
    tax_system_code?: number;
    on_behalf_of?: string;
}